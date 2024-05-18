interface PasswordPayload {
    identifier: string;
  }
  interface RotateAESKeyAndIVPayload {
    passUid: string;
  }
  interface RotateCharsetThunk{
    passUid:string;
  
  }
  interface EncryptPasswordThunk{
    passUid:string;
    password:string;
  }
  interface DecryptPasswordThunk{
    passUid:string;
    pmsFile:File ;
  
  }
  interface DeletePasswordThunk{
    passUid:string;
  }
  interface DownloadBackupThunk{
    backupName:string;
  }
  interface GenerateBackupThunk{
    password:string ;
  }
  interface UploadBackupThunk{
    backupFile:File ;
    password:string ;
  }
  interface Password {
    pass_uid: string;
    aes_last_rotated: string;
    charset_last_rotated :string;
    
  }
  interface UpdatedPassword {
    pass_uid: string;
    aes_last_rotated: string;
    
  
  }

interface DeviceInfo {
  
    [key: string]: any; 
  }

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
  }
  


  export {PasswordPayload,RotateAESKeyAndIVPayload,RotateCharsetThunk,EncryptPasswordThunk,DecryptPasswordThunk,DeletePasswordThunk,DownloadBackupThunk,GenerateBackupThunk,UploadBackupThunk,InitialState};