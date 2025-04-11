import { DashboardView } from "@/components/dashboard-view"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
  <>
  <DashboardView  />
  <ToastContainer position="top-right" autoClose={3000} />

  </>
  )
}

