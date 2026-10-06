"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createRecord as createRecordRequest,
  deleteRecord as deleteRecordRequest,
  uploadRecordFile as uploadRecordFileRequest,
  getCurrentUser,
  getDashboardSummary,
  listNotifications,
  listRecords,
  markAllNotificationsRead as markAllNotificationsReadRequest,
  markNotificationRead as markNotificationReadRequest,
  updateCurrentUser,
  updateRecord as updateRecordRequest,
  ApiError,
  type ApiNotification,
  type ApiRecord,
  type CareUser,
  type DashboardSummary,
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
};

type RecordPatch = {
  title?: string;
  recordType?: string;
  description?: string | null;
  doctorName?: string | null;
  hospitalName?: string | null;
  recordDate?: string | null;
};

type CareDataValue = {
  now: number;
  hydrated: boolean;
  user: CareUser | null;
  self: Member;
  members: Member[];
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

function mapRecord(record: ApiRecord, memberId: string): MedicalRecord {
  return {
    id: record.id,
    memberId,
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
  const [rawRecords, setRawRecords] = useState<ApiRecord[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [profileState, setProfileState] = useState<ResourceState>(initialResource);
  const [recordsState, setRecordsState] = useState<ResourceState>(initialResource);
  const [dashboardState, setDashboardState] = useState<ResourceState>(initialResource);
  const [notificationsState, setNotificationsState] = useState<ResourceState>(initialResource);
  const [now] = useState(() => Date.now());

  const refreshRecords = useCallback(async () => {
    setRecordsState({ status: "loading", error: null });
    try {
      const result = await listRecords();
      setRawRecords(result.items);
      setRecordsState({ status: "ready", error: null });
    } catch (error) {
      setRawRecords([]);
      setRecordsState(resourceError(error));
    }
  }, []);

  const refresh = useCallback(async () => {
    setProfileState({ status: "loading", error: null });
    setRecordsState({ status: "loading", error: null });
    setDashboardState({ status: "loading", error: null });
    setNotificationsState({ status: "loading", error: null });

    const [profileResult, recordsResult, dashboardResult, notificationsResult] =
      await Promise.allSettled([
        getCurrentUser(),
        listRecords(),
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

    if (recordsResult.status === "fulfilled") {
      setRawRecords(recordsResult.value.items);
      setRecordsState({ status: "ready", error: null });
    } else {
      setRawRecords([]);
      setRecordsState(resourceError(recordsResult.reason));
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
    try {
      const result = await updateCurrentUser(input);
      setUser(result.user);
      setProfileState({ status: "ready", error: null });
    } catch (error) {
      throw error;
    }
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
    const result = await createRecordRequest(input);
    setRawRecords((previous) => [result.record, ...previous]);
    return mapRecord(result.record, user?.id ?? SELF_ID);
  }, [user?.id]);

  const updateRecord = useCallback(async (id: string, input: RecordPatch) => {
    const result = await updateRecordRequest(id, input);
    setRawRecords((previous) =>
      previous.map((record) => (record.id === id ? result.record : record)),
    );
    return mapRecord(result.record, user?.id ?? SELF_ID);
  }, [user?.id]);

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

  const self = useMemo(() => (user ? mapUser(user) : blankMember), [user]);
  const members = useMemo(() => (user ? [self] : []), [self, user]);
  const account = useMemo(
    () => (user ? { email: user.email, phone: user.phone ?? "", avatar: "" } : emptyAccount),
    [user],
  );
  const records = useMemo(
    () => rawRecords.map((record) => mapRecord(record, user?.id ?? SELF_ID)),
    [rawRecords, user?.id],
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
      activeId: user?.id ?? SELF_ID,
      setActiveId: () => undefined,
      profileState,
      recordsState,
      dashboardState,
      notificationsState,
      dashboard,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      refresh,
      updateProfile,
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
      profileState,
      recordsState,
      dashboardState,
      notificationsState,
      dashboard,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      refresh,
      updateProfile,
      createRecord,
      updateRecord,
      uploadRecordFile,
      deleteRecord,
      refreshRecords,
    ],
  );

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
