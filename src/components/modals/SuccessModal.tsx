'use client';

import { useStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import MingcuteCelebrateLine from '~icons/mingcute/celebrate-line?width=48px&height=48px';
import MingcuteSadLine from '~icons/mingcute/sad-line?width=48px&height=48px';
import BiExclamation from '~icons/bi/exclamation?width=48px&height=48px';
import React from 'react';

export function Modal() {
  const router = useRouter();
  const modal = useStore((state) => state.modal);
  const store = useStore((state) => state);

  const handleOk = () => {
    modal.redirectUrl && router.push(modal.redirectUrl);
    store.setModal({
      isOpen: false,
      type: undefined,
      message: undefined,
      redirectUrl: undefined,
    });
  };

  let bgStyle = '';
  let icon;
  let approveMessage;
  if (modal.type === 'error') {
    bgStyle = 'bg-badRed';
    icon = <MingcuteSadLine className="text-white" width={48} height={48} />;
    approveMessage = 'OK:(';
  } else if (modal.type === 'success') {
    bgStyle = 'bg-goodGreen ';
    icon = (
      <MingcuteCelebrateLine className="text-white" width={48} height={48} />
    );
    approveMessage = 'Cool!';
  } else if (modal.type === 'warning') {
    bgStyle = 'bg-middleYellow';
    icon = <BiExclamation className="text-white" width={48} height={48} />;
    approveMessage = 'OK!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className={`relative z-10 w-full max-w-sm rounded-lg bg-white shadow-lg`}
      >
        <div
          className={`flex flex-row items-center justify-center gap-2 rounded-t-lg text-center text-mainDark ${bgStyle} p-6`}
        >
          <p className="text-2xl font-semibold text-white">{modal.message}</p>
          {icon}
        </div>
        <div className="m-6 flex justify-center">
          <button
            onClick={handleOk}
            className={`rounded-[7px] border-2 border-mainBlack px-2 py-1 text-xl text-mainBlack transition-all hover:border-mainOrange hover:text-mainOrange`}
          >
            {approveMessage}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
