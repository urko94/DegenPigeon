'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import TransferUpload from './upload/TransferUpload';
import Transfers from './Transfers';
import NormalUpload from './upload/NormalUpload';
import { ActionMode, useAuth } from '@/context/AuthContext';
import useScreen from '@/hooks/useScreen';

const Main = () => {
  const { isAuthenticated, actionMode, setActionMode } = useAuth();
  const { isXl } = useScreen();

  useEffect(() => {
    if (isXl && actionMode === ActionMode.HISTORY) {
      setActionMode(ActionMode.TRANSFER);
    }
  }, [isXl, actionMode]);

  let UploadComponent;
  if (actionMode === ActionMode.HISTORY) {
    UploadComponent = Transfers;
  } else if (actionMode === ActionMode.STORAGE) {
    UploadComponent = NormalUpload;
  } else {
    UploadComponent = TransferUpload;
  }

  return (
    <div className='flex justify-center gap-6 mt-8 '>
      {isXl && <div className='max-w-xs w-full'> </div>}

      <div className='max-w-[45rem] w-full bg-bg-dark rounded-2xl p-8 lg:p-10 xl:px-32'>
        <div className='text-center'>
          <Image
            src='/images/pigeon.png'
            alt='Degen pigeon'
            width={128}
            height={128}
            className='w-[128px] mx-auto translate-y-3 transition-all duration-200 '
          />
          <h1 className='text-2xl font-bold my-4 text-text-dark'>
            DegenPigeon
          </h1>

          <div className='inline-flex items-center justify-between  bg-brown  text-xs rounded-full mb-4'>
            {Object.values(ActionMode).map((mode) => (
              <a
                key={mode}
                className={`flex cursor-pointer py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform text-white 
                  ${
                    mode === actionMode
                      ? 'bg-brown-dark'
                      : 'hover:bg-brown-dark'
                  }
                ${isXl && mode === ActionMode.HISTORY ? 'hidden' : ''}
                `}
                onClick={() => setActionMode(mode)}
              >
                {mode}
              </a>
            ))}
          </div>

          <p className='whitespace-break-spaces'>
            {actionMode === ActionMode.TRANSFER
              ? 'Upload. Send. Done. \nDegenPigeon delivers—unstoppable files on a decentralized network.'
              : 'Upload, enter email, done. Your files are shared over decentralized network, making them unstoppable.'}
          </p>
          <p className='font-bold mb-4'>Welcome to Web3!</p>
        </div>

        <div className=''>
          <UploadComponent />
        </div>
      </div>

      {isXl && (
        <div className='max-w-xs w-full '>
          {isAuthenticated && (
            <div className=' bg-bg-dark rounded-2xl min-h-[66%]'>
              <Transfers />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
