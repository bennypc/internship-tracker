import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProfileBanner from '../components/ProfileBanner';
import MainLayout from '../components/Layout/MainLayout';

export default function ProfilePage() {
  const router = useRouter();

  return <MainLayout mainContent={<div />} asideContent={<div></div>} />;
}
