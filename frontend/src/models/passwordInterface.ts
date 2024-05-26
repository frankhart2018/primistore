interface PasswordPayload {
  identifier: string;
  policy: string;
}
interface RotateAESKeyAndIVPayload {
  passUid: string;
}
interface RotateCharsetThunk {
  passUid: string;
}
interface EncryptPasswordThunk {
  passUid: string;
  password: string;
}
interface DecryptPasswordThunk {
  passUid: string;
  pmsFile: File;
}
interface DeletePasswordThunk {
  passUid: string;
}
interface DownloadBackupThunk {
  backupName: string;
}
interface GenerateBackupThunk {
  password: string;
}
interface UploadBackupThunk {
  backupFile: File;
  password: string;
}
interface CreatePolicyThunk {
  policyName: string;
  updateWindowMin: number;
  updateWindowMax: number;
}
interface PasswordPolicyIdThunk {
  passUid: string;
}
interface PasswordPolicyUpdateThunk {
  passUid: string;
  policyId: string;
}

interface Password {
  pass_uid: string;
  aes_last_rotated: string;
  charset_last_rotated: string;
  policy_id: string;
}

interface DeviceInfo {
  [key: string]: any;
}

interface Policy {
  _id: string;
  policy_name: string;
  update_window_min: number;
  update_window_max: number;
}

type PolicyMap = {
  [id: string]: Policy;
};

interface InitialState {
  created: boolean;
  passwords: Password[];
  encryptedData: number[];
  decryptedData: string;
  rawData: string;
  deviceInfo: DeviceInfo;
  backupName: string | null;
  backupData: any | null;
  backupRestorationSuccess: boolean;
  policies: Policy[] | null;
  policyMap: PolicyMap;
  currentPolicy: Policy | null;
}

export {
  PasswordPayload,
  RotateAESKeyAndIVPayload,
  RotateCharsetThunk,
  EncryptPasswordThunk,
  DecryptPasswordThunk,
  DeletePasswordThunk,
  DownloadBackupThunk,
  GenerateBackupThunk,
  UploadBackupThunk,
  InitialState,
  CreatePolicyThunk,
  Password,
  PasswordPolicyIdThunk,
  PasswordPolicyUpdateThunk,
};
