"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createFamilyMember as createFamilyMemberRequest,
  createRecord as createRecordRequest,
  deleteFamilyMember as deleteFamilyMemberRequest,
  deleteRecord as deleteRecordRequest,
  listFamilyMembers,
  uploadRecordFile as uploadRecordFileRequest,
  getCurrentUser,
  getDashboardSummary,
  listNotifications,
  listRecords,
  markAllNotificationsRead as markAllNotificationsReadRequest,
  markNotificationRead as markNotificationReadRequest,
  updateCurrentUser,
  updateFamilyMember as updateFamilyMemberRequest,
  updateRecord as updateRecordRequest,
  ApiError,
  type ApiFamilyMember,
  type ApiNotification,
  type ApiRecord,
  type CareUser,
  type DashboardSummary,
  type FamilyGender,
} from "./api";
import { API_RECORD_TYPE_TO_LABEL, MEMBER_COLORS, SELF_ID } from "./data";
import type { Account, MedicalRecord, Member } from "./types";
import Link from "next/link";

type ResourceState = {
  status: "loading" | "ready" | "error";
  error: string | null;
  statusCode?: number;
};

type ProfilePatch = Partial<
  Pick<CareUser, "firstName" | "lastName" | "phone" | "dateOfBirth" | "gender">
>;

type RecordInput = {
  title: string;
  recordType: string;
  description?: string;
  doctorName?: string;
  hospitalName?: string;
  recordDate?: string;
  familyMemberId?: string;
};

type RecordPatch = {
  title?: string;
  recordType?: string;
  description?: string | null;
  doctorName?: string | null;
  hospitalName?: string | null;
  recordDate?: string | null;
  familyMemberId?: string | null;
};

type CareDataValue = {
  now: number;
  hydrated: boolean;
  user: CareUser | null;
  self: Member;
  members: Member[];
  familyState: ResourceState;
  account: Account;
  records: MedicalRecord[];
  scopedRecords: MedicalRecord[];
  memberById: Map<string, Member>;
  activeId: string;
  setActiveId: (id: string) => void;
  profileState: ResourceState;
  recordsState: ResourceState;
  dashboardState: ResourceState;
  notificationsState: ResourceState;
  dashboard: DashboardSummary | null;
  notifications: ApiNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (input: ProfilePatch) => Promise<void>;
  createFamilyMember: (input: {
    name: string;
    relationship: string;
    dateOfBirth?: string;
    gender?: FamilyGender;
  }) => Promise<void>;
  updateFamilyMember: (id: string, input: {
    name?: string;
    relationship?: string;
    dateOfBirth?: string | null;
    gender?: FamilyGender | null;
  }) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  createRecord: (input: RecordInput) => Promise<MedicalRecord>;
  updateRecord: (id: string, input: RecordPatch) => Promise<MedicalRecord>;
  uploadRecordFile: (id: string, file: File) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
};

const blankMember: Member = {
  id: SELF_ID,
  name: "",
  relation: "Self",
  isSelf: true,
  dob: "",
  gender: "",
  bloodGroup: "",
  heightCm: "",
  weightKg: "",
  allergies: [],
  conditions: [],
  medications: [],
  primaryDoctor: "",
  insurance: "",
  organDonor: false,
  contacts: [],
  color: MEMBER_COLORS[0],
};

const emptyAccount: Account = { email: "", phone: "", avatar: "" };
const initialResource: ResourceState = { status: "loading", error: null };

const CareDataContext = createContext<CareDataValue | null>(null);

function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.status >= 500) {
    return "CareTwin is temporarily unavailable. Please try again shortly.";
  }
  return error instanceof Error ? error.message : "The request failed. Please try again.";
}

function resourceError(error: unknown): ResourceState {
  return {
    status: "error",
    error: errorMessage(error),
    statusCode: error instanceof ApiError ? error.status : undefined,
  };
}

function mapUser(user: CareUser): Member {
  return {
    ...blankMember,
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    dob: user.dateOfBirth?.slice(0, 10) ?? "",
    gender: user.gender ?? "",
  };
}

function mapFamilyMember(member: ApiFamilyMember): Member {
  return {
    ...blankMember,
    id: member.id,
    name: member.name,
    relation: member.relationship,
    isSelf: member.isSelf,
    dob: member.dateOfBirth ?? "",
    gender: member.gender ?? "",
    color: MEMBER_COLORS[member.id.length % MEMBER_COLORS.length],
  };
}

function mapRecord(record: ApiRecord, selfMemberId: string): MedicalRecord {
  return {
    id: record.id,
    memberId: record.familyMemberId ?? selfMemberId,
    type: API_RECORD_TYPE_TO_LABEL[record.recordType] ?? "Other",
    title: record.title,
    description: record.description ?? "",
    date: record.recordDate?.slice(0, 10) ?? record.createdAt.slice(0, 10),
    doctor: record.doctorName ?? "",
    hospital: record.hospitalName ?? undefined,
    createdAt: record.createdAt,
    fileName: record.fileName ?? undefined,
    hasFile: record.hasFile,
  };
}

export function CareDataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CareUser | null>(null);
  const [familyMembers, setFamilyMembers] = useState<ApiFamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [rawRecords, setRawRecords] = useState<ApiRecord[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [profileState, setProfileState] = useState<ResourceState>(initialResource);
  const [familyState, setFamilyState] = useState<ResourceState>(initialResource);
  const [recordsState, setRecordsState] = useState<ResourceState>(initialResource);
  const [dashboardState, setDashboardState] = useState<ResourceState>(initialResource);
  const [notificationsState, setNotificationsState] = useState<ResourceState>(initialResource);
  const [now] = useState(() => Date.now());
  const recordsRequestId = useRef(0);

  const mappedFamilyMembers = useMemo(
    () => familyMembers.map(mapFamilyMember),
    [familyMembers],
  );
  const self = useMemo(() => {
    const selfFamilyMember = familyMembers.find((member) => member.isSelf);
    return selfFamilyMember
      ? mapFamilyMember(selfFamilyMember)
      : user
        ? mapUser(user)
        : blankMember;
  }, [familyMembers, user]);
  const members = useMemo(() => {
    const hasSelf = mappedFamilyMembers.some((member) => member.isSelf);
    return user && !hasSelf
      ? [self, ...mappedFamilyMembers]
      : mappedFamilyMembers;
  }, [mappedFamilyMembers, self, user]);
  const activeId = members.some((member) => member.id === selectedMemberId)
    ? selectedMemberId as string
    : self.id;
  const setActiveId = useCallback((id: string) => {
    setSelectedMemberId(id);
  }, []);

  const refreshRecords = useCallback(async () => {
    const requestId = ++recordsRequestId.current;
    setRecordsState({ status: "loading", error: null });
    try {
      const result = await listRecords(
        familyState.status === "ready" ? activeId : undefined,
      );
      if (requestId !== recordsRequestId.current) return;
      setRawRecords(result.items);
      setRecordsState({ status: "ready", error: null });
    } catch (error) {
      if (requestId !== recordsRequestId.current) return;
      setRawRecords([]);
      setRecordsState(resourceError(error));
    }
  }, [activeId, familyState.status]);

  const refresh = useCallback(async () => {
    setProfileState({ status: "loading", error: null });
    setFamilyState({ status: "loading", error: null });
    setRecordsState({ status: "loading", error: null });
    setDashboardState({ status: "loading", error: null });
    setNotificationsState({ status: "loading", error: null });

    const [profileResult, familyResult, dashboardResult, notificationsResult] =
      await Promise.allSettled([
        getCurrentUser(),
        listFamilyMembers(),
        getDashboardSummary(),
        listNotifications(),
      ]);

    if (profileResult.status === "fulfilled") {
      setUser(profileResult.value.user);
      setProfileState({ status: "ready", error: null });
    } else {
      setUser(null);
      setProfileState(resourceError(profileResult.reason));
    }

    if (familyResult.status === "fulfilled") {
      setFamilyMembers(familyResult.value.familyMembers);
      setFamilyState({ status: "ready", error: null });
    } else {
      setFamilyMembers([]);
      setFamilyState(resourceError(familyResult.reason));
    }

    if (dashboardResult.status === "fulfilled") {
      setDashboard(dashboardResult.value);
      setDashboardState({ status: "ready", error: null });
    } else {
      setDashboard(null);
      setDashboardState(resourceError(dashboardResult.reason));
    }

    if (notificationsResult.status === "fulfilled") {
      setNotifications(notificationsResult.value.items);
      setNotificationsState({ status: "ready", error: null });
    } else {
      setNotifications([]);
      setNotificationsState(resourceError(notificationsResult.reason));
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timeout);
  }, [refresh]);

  const updateProfile = useCallback(async (input: ProfilePatch) => {
    const result = await updateCurrentUser(input);
    setUser(result.user);
    setProfileState({ status: "ready", error: null });
    try {
      const familyResult = await listFamilyMembers();
      setFamilyMembers(familyResult.familyMembers);
      setFamilyState({ status: "ready", error: null });
    } catch (error) {
      setFamilyState(resourceError(error));
    }
  }, []);

  const createFamilyMember = useCallback(async (input: {
    name: string;
    relationship: string;
    dateOfBirth?: string;
    gender?: FamilyGender;
  }) => {
    const result = await createFamilyMemberRequest(input);
    setFamilyMembers((previous) => [...previous, result.familyMember]);
    setSelectedMemberId(result.familyMember.id);
    setFamilyState({ status: "ready", error: null });
  }, []);

  const updateFamilyMember = useCallback(async (id: string, input: {
    name?: string;
    relationship?: string;
    dateOfBirth?: string | null;
    gender?: FamilyGender | null;
  }) => {
    const result = await updateFamilyMemberRequest(id, input);
    setFamilyMembers((previous) =>
      previous.map((member) => member.id === id ? result.familyMember : member),
    );
  }, []);

  const deleteFamilyMember = useCallback(async (id: string) => {
    await deleteFamilyMemberRequest(id);
    setFamilyMembers((previous) => previous.filter((member) => member.id !== id));
    setSelectedMemberId((current) => current === id ? null : current);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    await markNotificationReadRequest(id);
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await markAllNotificationsReadRequest();
    setNotifications((previous) =>
      previous.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const createRecord = useCallback(async (input: RecordInput) => {
    let recordInput = input;
    if (familyState.status !== "ready") {
      const withoutFamilyMember = { ...input };
      delete withoutFamilyMember.familyMemberId;
      recordInput = withoutFamilyMember;
    }
    const result = await createRecordRequest(recordInput);
    setRawRecords((previous) => [result.record, ...previous]);
    if (familyState.status === "ready" && result.record.familyMemberId) {
      setSelectedMemberId(result.record.familyMemberId);
    }
    return mapRecord(result.record, user?.id ?? SELF_ID);
  }, [familyState.status, user?.id]);

  const updateRecord = useCallback(async (id: string, input: RecordPatch) => {
    let patch = input;
    if (familyState.status !== "ready") {
      const withoutFamilyMember = { ...input };
      delete withoutFamilyMember.familyMemberId;
      patch = withoutFamilyMember;
    }
    const result = await updateRecordRequest(id, patch);
    setRawRecords((previous) => {
      if (
        familyState.status === "ready" &&
        result.record.familyMemberId !== activeId
      ) {
        return previous.filter((record) => record.id !== id);
      }
      return previous.map((record) => (record.id === id ? result.record : record));
    });
    return mapRecord(result.record, user?.id ?? SELF_ID);
  }, [activeId, familyState.status, user?.id]);

  const uploadRecordFile = useCallback(async (id: string, file: File) => {
    await uploadRecordFileRequest(id, file);
    setRawRecords((previous) =>
      previous.map((record) =>
        record.id === id
          ? { ...record, fileName: file.name, hasFile: true }
          : record,
      ),
    );
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    await deleteRecordRequest(id);
    setRawRecords((previous) => previous.filter((record) => record.id !== id));
  }, []);

  const account = useMemo(
    () => (user ? { email: user.email, phone: user.phone ?? "", avatar: "" } : emptyAccount),
    [user],
  );
  const records = useMemo(
    () => rawRecords.map((record) => mapRecord(record, self.id)),
    [rawRecords, self.id],
  );
  const memberById = useMemo(() => new Map(members.map((member) => [member.id, member])), [members]);
  const hydrated =
    profileState.status !== "loading" && recordsState.status !== "loading";

  const value = useMemo<CareDataValue>(
    () => ({
      now,
      hydrated,
      user,
      self,
      members,
      account,
      records,
      scopedRecords: records,
      memberById,
      activeId,
      setActiveId,
      profileState,
      familyState,
      recordsState,
      dashboardState,
      notificationsState,
      dashboard,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      refresh,
      updateProfile,
      createFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      createRecord,
      updateRecord,
      uploadRecordFile,
      deleteRecord,
      refreshRecords,
    }),
    [
      now,
      hydrated,
      user,
      self,
      members,
      account,
      records,
      memberById,
      activeId,
      setActiveId,
      profileState,
      familyState,
      recordsState,
      dashboardState,
      notificationsState,
      dashboard,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      refresh,
      updateProfile,
      createFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      createRecord,
      updateRecord,
      uploadRecordFile,
      deleteRecord,
      refreshRecords,
    ],
  );

  useEffect(() => {
    if (profileState.status !== "ready" || familyState.status === "loading") return;
    const timer = window.setTimeout(() => void refreshRecords(), 0);
    return () => window.clearTimeout(timer);
  }, [profileState.status, familyState.status, activeId, refreshRecords]);

  if (profileState.status === "error" && profileState.statusCode === 401) {
    return (
      <CareDataContext.Provider value={value}>
        <section role="alert" className="mx-auto my-12 max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-ink">Sign in to view your dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-mute">Your CareTwin account is required to load profile and health data.</p>
          <Link href="/login" className="mt-5 inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Go to sign in
          </Link>
        </section>
      </CareDataContext.Provider>
    );
  }

  return <CareDataContext.Provider value={value}>{children}</CareDataContext.Provider>;
}

export function useCareData() {
  const value = useContext(CareDataContext);
  if (!value) throw new Error("useCareData must be used within CareDataProvider.");
  return value;
}
