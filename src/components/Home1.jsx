
import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FaCircle } from 'react-icons/fa';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IoSettingsOutline } from "react-icons/io5";



const Home = () => {
    const navigation = [
        { name: 'Dashboard', href: '#', current: true },
        { name: 'Calculation', href: '#', current: false }
    ]
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <main>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <IoSettingsOutline fontSize="1.5em" style={{ color: 'white' }} />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Your Profile
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Settings
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Sign out
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className='bg-gray-400 p-5'>
                <div class="flex justify-center gap-10">
                    <div className='flex-1 p-4 border rounded bg-white'>
                    <h1 className='text-center text-blue-600 font-semibold'>Weight</h1>
                    <div class='flex justify-warp'>
                        <div class='flex-1 p-4 border rounded bg-gray-300 text-center text-5xl font-semibold max-w-xl'>10.00</div>
                        <p className='flex items-center text-2xl font-bold'>Kg</p>
                    </div>
                    </div>

                    <div className='flex-1 p-4 border rounded max-w-md bg-white'>
                        <h1 className='text-center text-blue-600 font-semibold'>Status</h1>

                        <div className='flex justify-between'>
                            <p className=''>Green</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'green' }} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Yellow</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'red' }} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Red</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'red' }} />
                        </div>
                    </div>
                </div>

                <div class="flex justify-center gap-10 mt-10">
                    <div className='flex-1 p-4 border rounded bg-white'>
                        <h1 className='font-semibold text-blue-600 text-center'>Sensor Status</h1>
                        <div className='flex justify-between'>
                            <p className=''>Top</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'red' }} />
                        </div>

                        <div className='flex justify-between'>
                            <p>Bottom</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'green' }} />
                        </div>
                    </div>
                    <div className='flex-1 p-4 border rounded max-w-md bg-white'>
                        <h1 className='text-center font-semibold text-blue-600'>Lock Status</h1>

                        <div className='flex justify-between'>
                            <p className=''>Top</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'green' }} />
                        </div>

                        <div className='flex justify-between'>
                            <p>Bottom</p>
                            <FiberManualRecordIcon fontSize="small" style={{ color: 'red' }} />
                        </div>
                    </div>

                    <button className='flex-1 p-4 border rounded max-w-xs flex justify-center items-center bg-white font-semibold'>Lock Bottom
                    </button>
                </div>
                {/*  <footer className='flex-1 rounded border mt-10 flex justify-center gap-40 p-3 bg-white'  >
                    <p>Server Status: 192.168.1.5 Online</p>
                    <p>Status PLC : Online</p>
                </footer> */}
            </div>
            <footer className='flex-1 rounded border flex justify-center gap-40 p-3 bg-white'  >
                <p>Server Status: 192.168.1.5 Online</p>
                <p>Status PLC : Online</p>
            </footer>
        </main>
    );
};

export default Home;
