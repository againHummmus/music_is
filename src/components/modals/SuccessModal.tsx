'use client'

import { useStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import MingcuteCelebrateLine from '~icons/mingcute/celebrate-line?width=48px&height=48px';
import MingcuteSadLine from '~icons/mingcute/sad-line?width=48px&height=48px';
import BiExclamation from '~icons/bi/exclamation?width=48px&height=48px';
import React from 'react';

export function Modal () {
  const router = useRouter();
  const modal = useStore((state) => state.modal);
  const store = useStore((state) => state);

  const handleOk = () => {
    modal.redirectUrl && router.push(modal.redirectUrl);
    store.setModal({ isOpen: false, type: undefined, message: undefined, redirectUrl: undefined });
  };

  let bgStyle = '';
  let icon;
  let approveMessage;
  if (modal.type === 'error') {
    bgStyle = 'bg-badRed';
    icon = <MingcuteSadLine className="text-white" width={48} height={48} />;
    approveMessage = 'OK:('
  } else if (modal.type === 'success') {
    bgStyle = 'bg-goodGreen ';
    icon = <MingcuteCelebrateLine className="text-white" width={48} height={48} />;
    approveMessage = 'Cool!'
  } else if (modal.type === 'warning') {
    bgStyle = 'bg-middleYellow';
    icon = <BiExclamation className="text-white" width={48} height={48} />;
    approveMessage = 'OK!'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`relative bg-white rounded-lg shadow-lg z-10 max-w-sm w-full`}>
        <div className={`flex flex-row gap-2 justify-center items-center text-mainDark rounded-t-lg text-center ${bgStyle} p-6`}>
          <p className="font-semibold text-white text-2xl ">{modal.message}</p>
          {icon}
        </div>
        <div className="m-6 flex justify-center">
            <button onClick={handleOk} className={`px-2 py-1 rounded-[7px] border-2 border-mainBlack text-mainBlack hover:text-mainOrange text-xl hover:border-mainOrange transition-all`}>
                {approveMessage}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
