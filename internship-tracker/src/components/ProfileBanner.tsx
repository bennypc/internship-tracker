import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

interface ProfileBannerProps {
  profile: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    backgroundImage: string;
    fields: [string, string][];
  };
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ profile }) => {
  const [avatarURL, setAvatarURL] = useState(profile.avatar);
  const [bannerURL, setBannerURL] = useState(profile.backgroundImage);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const url = await getDownloadURL(
          ref(storage, `profilePictures/${profile.uid}/profile.jpg`)
        );
        setAvatarURL(url);
      } catch (error) {
        console.error('Error fetching avatar URL:', error);
      }
    };

    const fetchBanner = async () => {
      try {
        const url = await getDownloadURL(
          ref(storage, `bannerImages/${profile.uid}/banner.jpg`)
        );
        setBannerURL(url);
      } catch (error) {
        console.error('Error fetching banner URL:', error);
      }
    };

    if (profile.avatar) {
      fetchAvatar();
    }

    if (profile.backgroundImage) {
      fetchBanner();
    }
  }, [profile.avatar, profile.uid, profile.backgroundImage]);

  return (
    <div>
      <div>
        <img
          alt=''
          src={bannerURL}
          className='h-32 w-full object-cover lg:h-48'
        />
      </div>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
          <div className='flex'>
            <img
              alt=''
              src={avatarURL}
              className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
            />
          </div>
          <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
            <div className='mt-6 min-w-0 flex-1 sm:hidden md:block'>
              <h1 className='truncate text-2xl font-bold text-gray-900'>
                {profile.name}
              </h1>
            </div>
            <div className='mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <button
                type='button'
                className='inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                <EnvelopeIcon
                  aria-hidden='true'
                  className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400'
                />
                <span>Message</span>
              </button>
              <button
                type='button'
                className='inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                <PhoneIcon
                  aria-hidden='true'
                  className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400'
                />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
        <div className='mt-6 hidden min-w-0 flex-1 sm:block md:hidden'>
          <h1 className='truncate text-2xl font-bold text-gray-900'>
            {profile.name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
