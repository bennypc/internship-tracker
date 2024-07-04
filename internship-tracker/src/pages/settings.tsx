import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from '@headlessui/react';
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig'; // Adjust the import path as necessary
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../authContext'; // Use the Auth context
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: false },
  { name: 'Profile', href: '#', icon: UserIcon, current: false },
  { name: 'Applications', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true }
];

const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Security', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Privacy', href: '#', current: false }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Settings() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [logoutPassword, setLogoutPassword] = useState('');

  const router = useRouter();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    education: '',
    linkedin: '',
    website: '',
    photoURL: ''
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfileData({
            firstName: userDoc.data().profile.firstName,
            lastName: userDoc.data().profile.lastName,
            displayName: userDoc.data().displayName,
            email: userDoc.data().email,
            phoneNumber: userDoc.data().profile.phoneNumber,
            bio: userDoc.data().profile.bio,
            education: userDoc.data().profile.education,
            linkedin: userDoc.data().profile.linkedin,
            website: userDoc.data().profile.website,
            photoURL: userDoc.data().profile.photoURL
          });
        }
      };
      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.size <= 8 * 1024 * 1024 &&
      file.type.startsWith('image/')
    ) {
      // Ensure file is <= 8MB and is an image
      setSelectedFile(file);
    } else {
      alert('File must be an image and less than 8MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let downloadURL = profileData.photoURL;

      // Check if there is a new profile picture to upload
      if (selectedFile) {
        // Create a reference to the old file in Firebase Storage
        const oldFileRef = ref(
          storage,
          `profilePictures/${user.uid}/profile.jpg`
        );

        // Delete the old profile picture if it exists
        if (downloadURL) {
          await deleteObject(oldFileRef).catch((error) => {
            console.log(
              'Old profile picture does not exist or could not be deleted:',
              error
            );
          });
        }

        // Create a reference to the new file in Firebase Storage
        const newFileRef = ref(
          storage,
          `profilePictures/${user.uid}/profile.jpg`
        );

        // Upload the new file
        const snapshot = await uploadBytes(newFileRef, selectedFile);

        // Get the URL of the uploaded file
        downloadURL = await getDownloadURL(snapshot.ref);

        // Update the profile picture URL in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          'profile.photoURL': downloadURL
        });
      }

      // Update the rest of the profile data
      const userProfileData = {
        profile: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          bio: profileData.bio,
          education: profileData.education,
          linkedin: profileData.linkedin,
          website: profileData.website,
          photoURL: downloadURL // Ensure this is handled correctly
        },
        displayName: profileData.displayName,
        email: profileData.email,
        updatedAt: new Date()
      };
      await updateDoc(doc(db, 'users', user.uid), userProfileData);

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      if (logoutAllDevices) {
        await signOut(auth);
        router.push('/login');
      }
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  const handleLogoutOtherSessions = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        logoutPassword
      );
      await reauthenticateWithCredential(user, credential);
      await signOut(auth); // This will sign out the user from all sessions
      alert('Logged out of all other sessions successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out of other sessions:', error);
      alert('Failed to log out of other sessions');
    }
  };

  return (
    <>
      <div>
        <Transition show={sidebarOpen}>
          <Dialog className='relative z-50 lg:hidden' onClose={setSidebarOpen}>
            <TransitionChild
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </TransitionChild>

            <div className='fixed inset-0 flex'>
              <TransitionChild
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <DialogPanel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <TransitionChild
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </TransitionChild>

                  <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10'>
                    <div className='flex h-16 shrink-0 items-center'>
                      <img
                        className='h-8 w-auto'
                        src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                        alt='Your Company'
                      />
                    </div>
                    <nav className='flex flex-1 flex-col'>
                      <ul role='list' className='-mx-2 flex-1 space-y-1'>
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                              )}
                            >
                              <item.icon
                                className='h-6 w-6 shrink-0'
                                aria-hidden='true'
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4'>
          <div className='flex h-16 shrink-0 items-center justify-center'>
            <img
              className='h-12 w-auto mt-4'
              src='https://edrm.net/wp-content/uploads/2023/12/RL10_01.jpg'
            />
          </div>
          <nav className='mt-8'>
            <ul role='list' className='flex flex-col items-center space-y-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6'
                    )}
                  >
                    <item.icon
                      className='h-6 w-6 shrink-0'
                      aria-hidden='true'
                    />
                    <span className='sr-only'>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden'>
          <button
            type='button'
            className='-m-2.5 p-2.5 text-gray-400 lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
          <div className='flex-1 text-sm font-semibold leading-6 text-white'>
            Dashboard
          </div>
          <a href='#'>
            <span className='sr-only'>Your profile</span>
            <img
              className='h-8 w-8 rounded-full bg-gray-800'
              src={
                profileData.photoURL ||
                'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
              }
              alt=''
            />
          </a>
        </div>

        <main className='lg:pl-20'>
          <div className=''>
            <div className='px-4 py-10 sm:px-6 lg:px-8 lg:py-6'>
              <h1 className='sr-only'>Account Settings</h1>

              <header className='border-b border-gray-200'>
                {/* Secondary navigation */}
                <nav className='flex overflow-x-auto py-4'>
                  <ul
                    role='list'
                    className='flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-900 sm:px-6 lg:px-8'
                  >
                    {secondaryNavigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={item.current ? 'text-indigo-600' : ''}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </header>

              {/* Settings forms */}
              <div className='divide-y divide-gray-200'>
                <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Personal Information
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      You can customize the information displayed on your
                      profile in the 'Privacy' tab.
                    </p>
                  </div>

                  <form className='md:col-span-2' onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
                      <div className='col-span-full flex items-center gap-x-8'>
                        <img
                          src={
                            profileData.photoURL ||
                            'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                          }
                          alt=''
                          className='h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover'
                        />
                        <div>
                          <label
                            htmlFor='profilePicture'
                            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer'
                          >
                            Change avatar
                          </label>
                          <input
                            id='profilePicture'
                            name='profilePicture'
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
                            className='hidden'
                          />
                          <p className='mt-2 text-xs leading-5 text-gray-600'>
                            JPG, GIF or PNG. 8MB max.
                          </p>
                        </div>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor='firstName'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          First name
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='firstName'
                            id='firstName'
                            value={profileData.firstName}
                            onChange={handleChange}
                            autoComplete='given-name'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor='lastName'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Last name
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='lastName'
                            id='lastName'
                            value={profileData.lastName}
                            onChange={handleChange}
                            autoComplete='family-name'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='displayName'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Display Name
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='displayName'
                            id='displayName'
                            value={profileData.displayName}
                            onChange={handleChange}
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Email address
                        </label>
                        <div className='mt-2'>
                          <input
                            id='email'
                            name='email'
                            type='email'
                            value={profileData.email}
                            onChange={handleChange}
                            autoComplete='email'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='phoneNumber'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Phone Number
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='phoneNumber'
                            id='phoneNumber'
                            value={profileData.phoneNumber}
                            onChange={handleChange}
                            autoComplete='tel'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='bio'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Bio
                        </label>
                        <div className='mt-2'>
                          <textarea
                            id='bio'
                            name='bio'
                            rows={3}
                            value={profileData.bio}
                            onChange={handleChange}
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                        <p className='mt-2 text-sm text-gray-600'>
                          Write a few sentences about yourself.
                        </p>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='education'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          University or College
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='education'
                            id='education'
                            value={profileData.education}
                            onChange={handleChange}
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='linkedin'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          LinkedIn Profile
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='linkedin'
                            id='linkedin'
                            value={profileData.linkedin}
                            onChange={handleChange}
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='website'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Website
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='website'
                            id='website'
                            value={profileData.website}
                            onChange={handleChange}
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='mt-8 flex'>
                      <button
                        type='submit'
                        className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>

                <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Change password
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      Update your password associated with your account.
                    </p>
                  </div>

                  <form
                    className='md:col-span-2'
                    onSubmit={handleChangePassword}
                  >
                    <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
                      <div className='col-span-full'>
                        <label
                          htmlFor='current-password'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Current password
                        </label>
                        <div className='mt-2'>
                          <input
                            id='current-password'
                            name='current_password'
                            type='password'
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete='current-password'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='new-password'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          New password
                        </label>
                        <div className='mt-2'>
                          <input
                            id='new-password'
                            name='new_password'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete='new-password'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='confirm-password'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Confirm password
                        </label>
                        <div className='mt-2'>
                          <input
                            id='confirm-password'
                            name='confirm_password'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete='new-password'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>
                    <fieldset className='mt-8'>
                      <div className='relative flex items-start'>
                        <div className='flex h-6 items-center'>
                          <input
                            id='logoutAllDevices'
                            name='logoutAllDevices'
                            type='checkbox'
                            checked={logoutAllDevices}
                            onChange={(e) =>
                              setLogoutAllDevices(e.target.checked)
                            }
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          />
                        </div>
                        <div className='ml-3 text-sm leading-6'>
                          <label
                            htmlFor='logoutAllDevices'
                            className='font-medium text-gray-900'
                          >
                            Log out of all devices
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <div className='mt-8 flex'>
                      <button
                        type='submit'
                        className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>

                <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Log out other sessions
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      Please enter your password to confirm you would like to
                      log out of your other sessions across all of your devices.
                    </p>
                  </div>

                  <form
                    className='md:col-span-2'
                    onSubmit={handleLogoutOtherSessions}
                  >
                    <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
                      <div className='col-span-full'>
                        <label
                          htmlFor='logout-password'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Your password
                        </label>
                        <div className='mt-2'>
                          <input
                            id='logout-password'
                            name='password'
                            type='password'
                            value={logoutPassword}
                            onChange={(e) => setLogoutPassword(e.target.value)}
                            autoComplete='current-password'
                            className='px-3 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='mt-8 flex'>
                      <button
                        type='submit'
                        className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      >
                        Log out other sessions
                      </button>
                    </div>
                  </form>
                </div>

                <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Delete account
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      No longer want to use our service? You can delete your
                      account here. This action is not reversible. All
                      information related to this account will be deleted
                      permanently.
                    </p>
                  </div>

                  <form
                    className='flex items-start md:col-span-2'
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Add your delete account logic here
                    }}
                  >
                    <button
                      type='submit'
                      className='rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500'
                    >
                      Yes, delete my account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
