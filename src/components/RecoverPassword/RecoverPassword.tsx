'use client';

import { PageTitle } from '../Common/PageTitle';
import { RecoverPasswordForm } from './RecoverPasswordForm';
import { LottieRecover } from 'src/components/Dashboard/DashWidgets/DashWidgets';

export const RecoverPassWord = () => {
  return (
    <div className="w-full px-8 py-4">
      <PageTitle title="RECUPERAR CONTRASEÑA" />
      <div className="flex items-center justify-center p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-4xl">
          <div className="flex justify-center">
            <LottieRecover />
          </div>
          <div>
            <RecoverPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};
