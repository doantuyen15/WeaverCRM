import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SidebarLayout } from '../components/Sidebar';

const IndexPage = () => {


  return (
    <div className="flex flex-col min-h-[100vh] bg-[#F6F8FA] w-full nourd-text admin-dashboard">
      <div className='min-w-[100vw]'>
        <Layout children={null}></Layout>
      </div>
      <div className='flex flex-1 flex-row'>
        <SidebarLayout />
        <div className='flex-1'>
          <div>

          </div>
        </div>
      </div>

    </div>
  )
}
export default IndexPage;