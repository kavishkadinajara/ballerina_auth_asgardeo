declare module '@next-auth/typeorm-adapter' {
  import { Adapter } from 'next-auth/adapters';

  type TypeORMAdapterConfig = {
    synchronize?: boolean;
    connectionString?: string;
  };

  export function TypeORMAdapter(connection: any, config?: TypeORMAdapterConfig): Adapter;
}
