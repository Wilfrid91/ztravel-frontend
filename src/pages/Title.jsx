import React from 'react'
/* rfc */

/* 2 props */
export default function Title({ name, title }) {
  return (
    <div className='row'>
      {/* 10 columns wide on small screen, center,  */}
      <div className='col-10 mx-auto my-2 text-center text-title'>
        <h1 className='text-capitalize font-weight-bold'>{name}</h1>
        <strong className='text-blue'>{title}</strong>
      </div>
    </div>
  )
}
