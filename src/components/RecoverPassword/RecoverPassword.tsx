'use client';

import { PageTitle } from '../Common/PageTitle';
import { RecoverPasswordForm } from './RecoverPasswordForm';

export const RecoverPassWord = () => {

  return (
    <div className="w-full px-8 py-4">
      <PageTitle title="RECUPERAR CONTRASEÑA" />
        <div className='flex items-center justify-center p-16' >
            <RecoverPasswordForm/>
        </div>
    </div>
  );
};
