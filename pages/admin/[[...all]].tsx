import dynamic from 'next/dynamic';

const AdminApp = dynamic(() => import('../../admin/app'), { ssr: false });

export default function Admin() {
  console.log('admin');
  return <AdminApp />;
}
