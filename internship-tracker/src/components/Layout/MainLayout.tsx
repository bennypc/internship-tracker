import Sidebar from './Sidebar';

interface MainLayoutProps {
  mainContent: React.ReactNode;
  asideContent: React.ReactNode;
}

export default function MainLayout({
  mainContent,
  asideContent
}: MainLayoutProps) {
  return (
    <div>
      <Sidebar />
      <main className='lg:pl-20'>
        <div className='xl:pl-96'>
          <div className=''>{mainContent}</div>
        </div>
      </main>
      <aside className='fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block'>
        {asideContent}
      </aside>
    </div>
  );
}
