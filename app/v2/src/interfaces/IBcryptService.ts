
export interface IBcryptService {
  
  updateUUID(): void;

  getUUID(): string;

  getHashedPassword(): Promise<string>;

}