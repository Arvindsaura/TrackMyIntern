import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListings from '../components/JobListings'

import Footer from '../components/Footer'
import Features from '../components/Features.jsx'

const Home = () => {
  return (
    <div>
      <Navbar/>
      
      <JobListings/>
      <Features/>
  
      <Footer/>
    </div>
  )
}

export default Home
