import React, { useState, useEffect, Fragment,useRef } from "react";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { IoSettingsOutline } from "react-icons/io5";
import { FiRefreshCcw } from "react-icons/fi";
import {Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import axios from "axios";
import io from 'socket.io-client';

//const socket = io('http://localhost:5001/');
const apiClient = axios.create({
    withCredentials: false
});
const Home = () => {
    const [Scales50Kg, setScales50Kg] = useState({});
    const [scanData, setScanData] = useState('');
    const [username, setUsername] = useState('');
    const [sensor, setSensor] = useState('');
    const [neto, setNeto] = useState(0);
    const [isFreeze, freezeNeto] = useState(false);
    const [isFinalStep, setFinalStep] = useState(false);
    const [containerName, setContainerName] = useState('');
    const [rollingDoorId, setRollingDoorId] = useState(-1);
    const [waste, setWaste] = useState(null);
    const [rackname, setRackname] = useState('');
    const [rackId, setRackId] = useState(-1);
    const [message, setmessage] = useState("");
    const [clientId, setClientId] = useState('');
    const [address, setAddress] = useState('');
    const [value, setValue] = useState('');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [idscarplog, setidscarplog] = useState('');
    const [socket,setSocket] = useState(); // Sesuaikan dengan alamat server
    const [apiTarget,setApiTarget] = useState(process.env.REACT_APP_PIDSG);
    //    const socket = null;
    const navigation = [
        { name: 'Dashboard', href: '#', current: true },
        { name: 'Calculation', href: '#', current: false }
    ]

    const [user, setUser] = useState(null);
    const [container, setContainer] = useState(null);
    const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalConfirmWeight, setShowModalConfirmWeight] = useState(false);
    const [showModalDone, setShowModalDone] = useState(false);
    const [wasteId, setWasteId] = useState(null);
    const [type, setType] = useState("");
    const inputRef = useRef(null);
    const [bottomLockHostData, setBottomLockData] = useState({ binId: ''});
    const toggleModal = () => {
        freezeNeto(true);
        setShowModal(!showModal);
    };

    /*const toggleModalConfirm = () => {
        setShowModalConfirmWeight(!showModalConfirmWeight);
    };*/

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: value > 70 ? '#f44336' : theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    useEffect(() => {
        if (setShowModalConfirmWeight && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showModalConfirmWeight]);

/*     useEffect(() => {
        getidscaplog();
      }, []); */

    const handleKeyPressModal = (e) => {
        if (e.key === 'Enter') {
            setShowModalConfirmWeight(false);
        }
    };
    useEffect(()=>{
        setSocket(io(`http://${process.env.REACT_APP_TIMBANGAN}/`));
    },[])
    const CustomLinearProgress = ({ value }) => {
        return (
            <LinearProgress
                variant="determinate"
                value={value}
                color={value > 70 ? 'error' : 'primary'}
                style={{ width: '90%', height: 10, borderRadius: 5, marginRight: '10px' }}
            />
        );
    };

    useEffect(() => {
        if (!socket)
            return;
	socket.emit('connectScale');
        socket.on('data1', (weight50Kg) => {
            try {
                weight50Kg.weight50Kg = weight50Kg && weight50Kg.weight50Kg ? parseFloat(weight50Kg.weight50Kg.replace("=", "") ?? '0') : 0;
                setScales50Kg(weight50Kg);
            }
            catch { }
        });
    }, [socket]);
    useEffect(() => {
        const weight = Scales50Kg?.weight50Kg ?? 0;
        const binWeight = container?.weightbin ?? 0;
	//weight = weight - binWeight;
        if (isFreeze)
            return
        setNeto(weight)
    }, [Scales50Kg])

    useEffect(() => {
        if (bottomLockHostData.binId != '') {
            new Promise(async ()=>
                {
                    //await sendDataPanasonicServerCollection();
                    await UpdateBinWeightCollection();
                    Promise.resolve();
                }).then(()=>{
                setBottomLockData({binId:''});
                //setinstruksimsg("buka penutup bawah");
            });
        }
    }, [bottomLockHostData]);

    const sendDataPanasonicServer = async () => {
        const idmachine = await getidmachine();
        try {
            const response = await apiClient.post(`http://${apiTarget}/api/pid/pidatalog`, {
                badgeno: user.badgeId,
                logindate: '',
                stationname: "2-PCS-SP",
                frombinname: idmachine,
                tobinname: "2-PCS-5",
                weight: neto,
                activity: type

            });
            if (response.status != 200) {
               return;
            }
        }
        catch (error) {
        }
    };

    const sendDataPanasonicServerCollection = async (_container) => {
        //const totalWeight = await getTotalweight();
        try {
            const response = await apiClient.post(`http://${apiTarget}/api/pid/pidatalog`, {
                badgeno: "123",
                logindate: '',
                stationname: "2-PCS-SP",
                frombinname: "2-PCS-5",
                tobinname: "2-PCS-5",
                weight: _container.weight,
                activity: "Collection"

            });
            if (response.status != 200) {
                return;
            }
        }
        catch (error) {
        }
    }

    const sendDataWeightPanasonicServer = async () => {
        try {
            const response = await apiClient.post(`http://${apiTarget}/api/pid/sendWeight`, {
                binname: container.name,
                weight: neto,
            });
            if (response.status != 200) {
                return;
            }
        }
        catch (error) {
        }
    };
    const sendDataWeightPanasonicServerCollection = async (_container) => {
        try {
            const response = await apiClient.post(`http://${apiTarget}/api/pid/sendWeight`, {
                binname: containerName,
                weight: "0",
            });
            if (response.status != 200) {
                return;
            }
        }
        catch (error) {
        }
    }

     async function sendRackOpen(rack) {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_RACK}/rackOpen`, {
                clientId: rack.clientId,
                address: rack.address,
                value: rack.value
            });
        } catch (error) {
            console.log(error);
        }
    }; 

/*   async function sendSensorRack() {
        try {
            const response = await axios.post(`http://PCL-10.local:5001/sensorcheck`, {
                clientId: rack.clientId,
                address: rack.address,
                value: rack.value
            });
        } catch (error) {
            console.log(error);
        }
    }; */

    async function sendRackOpenCollection(bin) {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_RACK}/rackOpen`, {
                clientId: bin.clientid,
                address: bin.address,
                value: bin.value
            });
        } catch (error) {
            console.log(error);
        }
    }
    const handleScan = () => {
        axios.post('http://localhost:5001/ScanBadgeid', { badgeId: scanData })
            .then(res => {
                if (res.data.error) {
                    alert(res.data.error);
                } else {
                    if (res.data.user) {
                        setUser(res.data.user);
                        setScanData('');
                        setmessage("Scan Bin Machine/Bin");
                    } else {
                        alert("User not found");
                        setUser(null);
                        setContainerName(res.data.name || '');
                        setScanData('');
                        
                    }
                }
            })
            .catch(err => console.log(err));
    };

    const handleScan1 = async () => {
        try
        {
            const res =await  apiClient.post(`http://localhost:5001/ScanContainer`, { containerId: scanData });
            setScanData('');
            if (res.data.error) {
                alert(res.data.error);
            } else {
                if (res.data.container) {
                    /*if ( waste != null && res.data.container.IdWaste != waste.IdWaste ) {
                        alert("Waste Mismatch");
                        return;
                    }*/
                    setWaste(res.data.container.waste);
                    setStatus(res.data.container.status);
                    //sendDataPanasonicServerCollection();

                    if (res.data.container.status == 'Waiting Dispose To Step 2') {
            
                    } else if (res.data.container.status === null || res.data.container.status === '') {
                        alert("request dari step 1");
                        return; 
                    }
                   
                    if (res.data.container.type == "Collection") {
                        const _bin = res.data.container.waste.bin.find(item => item.name == res.data.container.name);

                        if (!_bin) {
                            alert("Bin Collection error");
                            return;
                        }
                        const collectionPayload = {...res.data.container,weight: _bin.weight};
                        saveTransaksiCollection(collectionPayload);
                        
                        setBottomLockData({ binId: _bin.rackId });
                        sendRackOpenCollection(_bin);
                        sendDataPanasonicServerCollection(collectionPayload);
                        sendDataWeightPanasonicServerCollection(collectionPayload);
                        setShowModal(false);
                        setScanData('');
                        setUser(null);
                        setContainer(null);
                        //sendType(_bin.name_hostname,'Collection');
                        //setBinname(_bin.name);
                        //setinstruksimsg('')
                        setmessage('');
                       
                        return;
                    }
                    else{
                        setContainer(res.data.container);
                        setType(res.data.container.type);
                        //setStatus(res.data.container.status);
                        setName(res.data.container.name);
                        //setShowModalInfoScales(true);
                        setmessage('Tekan Tombol Submit');
                       
                    }
                    //setWastename(res.data.container.waste.name);
                    setScanData('');
                    setIsSubmitAllowed(true);
                } else {
                    alert("Countainer not found");
                    setUser(null);
                    setContainer(null);
                    setContainerName(res.data.name || '');
                    setScanData('');
                    setIsSubmitAllowed(false);
                }
            }
        }
        catch(err)
        {
            setScanData('');
            alert("Error");
        }
    };
/*     useEffect(() => {
        if (rollingDoorId > -1)
        {
	        sendRollingDoorUp();
            triggerAvailableBin(false,container.idWaste);
        }
    }, [rollingDoorId]); */
    const handleSubmit = async () => {
        const binWeight = container?.weightbin ?? 0;
        const totalWeight = parseFloat(neto) + parseFloat(binWeight);

        if (type == 'Dispose') {
            if (neto > 50) {
                alert("Berat limbah melebihi kapasitas maksimum");
                return;
            }
        
            /* if (status == 'Waiting Dispose To Step 2') {
                
            } else if (status === null || status === '') {
                alert("request dari step 1");
                return; 
            } */
        
            await CheckBinCapacity();
            setShowModalConfirmWeight(true);
            setIsSubmitAllowed(false);
            setFinalStep(true); 
            setmessage('');
            setmessage('Waiting For Verification');
            //setShowModalDispose(true);
        }
        setShowModal(false);
    }
    const saveTransaksi = async () => {
        const idmachine = await getidmachine();
        try
        {
        const res =  await axios.post("http://localhost:5001/SaveTransaksi", {
            payload: {
                idContainer: container.containerId,
                badgeId: user.badgeId,
                IdWaste: container.IdWaste,
                weight: neto,
                type: 'Dispose',
                idqrmachine: idmachine
            },
            //rackId: rackId,
            clientId: clientId,
            address: sensor // frans pake sensor     

            });
            setWasteId(container.idWaste);
            setIsSubmitAllowed(false);
            setScanData('');
            return true;
        }
        catch (er)
        {
            
            alert("Transaksi fail, please check sensor");
            return false;
        }
    };

    const saveTransaksiCollection = (_container) => {
        apiClient.post("http://localhost:5001/SaveTransaksiCollection", {
            payload: {
                idContainer: _container.containerId,
                badgeId: user.badgeId,
                IdWaste: _container.IdWaste,
                type: _container.type,
                weight: _container.weight
            }
        }).then(res => {
            setWaste(null);
            setScanData('');
        });
    };

    const UpdateBinWeightCollection = async () => {
        try {
            const response = await apiClient.post('http://localhost:5001/UpdateBinWeightCollection', {
                binId: bottomLockHostData.binId
            }).then(x => {
                const res = x.data;
            });
        }
        catch (error) {
        }
    }

    const UpdateStatusContainer = async () => {
        try {
            const response = await apiClient.post('http://localhost:5001/UpdateStatusContainer', {
                name: container.name,
                status: ""
            }).then(x => {
                const res = x.data;
            });
        }
        catch (error) {
        }
    }

    const UpdateDataFromStep2 = async () => {
        try {
            const response = await apiClient.post('http://localhost:5000/UpdateStatus', {
                containerName: container.name,
                status: "Done"
            }).then(x => {
                const res = x.data;
            });
        }
        catch (error) {
        }
    };

    const UpdateDataFromStep2ToPanasonic = async (scraplogid) => {
        try {
            const response = await apiClient.put(`http://192.168.247.128/api/pid/step1/${scraplogid}`, {
                status: "Done"
            }).then(x => {
                const res = x.data;
            });
        }
        catch (error) {
        }
    };

    const getidscraplog = async () => {
        try {
            const response = await apiClient.post(`http://localhost:5000/Getidscarplog`, {
                status: container.status,
                idContainer : container.containerId
            });
            return response.data.data.idscraplog;
        }
        catch (error) {
            return null;
        }
    };

    const getidmachine = async () => {
        try {
            const response = await apiClient.post(`http://localhost:5000/Getidmachine`, {
                status: container.status,
                idContainer : container.containerId
            });
            return response.data.data.bin;
        }
        catch (error) {
            return null;
        }
    };

    const getTotalweight = async () => {
        try {
            const response = await apiClient.post(`http://localhost:5001/gettotalweight`, {
                name: container.waste.bin.name
            });
            return response.data.data.idscraplog;
        }
        catch (error) {
            return null;
        }
    };

    const CheckBinCapacity = async () => {
        try {
            const response = await apiClient.post('http://localhost:5001/CheckBinCapacity', {
                line: container.line,
                //neto: neto
            }).then(x => {
                const res = x.data;
                if (!res.success) {
                    alert(res.message);
                    return;
                }
               // setRollingDoorId(res.bin.id);
                setRackname(res.bins[0].name);
                setRackId(res.bins[0].rackId);
                setClientId(res.bins[0].clientId);
                setSensor(res.bins[0].sensor);//push lagi. oke.
                setAddress(res.bins[0].address);
                setValue(res.bins[0].value);
                //sendRackOpen(res.bins[0]);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const closeRollingDoor = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/rollingdoorDown`, {
                idRollingDoor: rollingDoorId,
            }).then(x => {
                setWasteId(null);
//                updateBinWeight();
            });
        } catch (error) {
            console.log(error);
        }
    }
    const updateBinWeight = async () => {
        try {
            const response = await axios.post('http://localhost:5001/UpdateBinWeight', {
                binId: rackId,
                weight: neto
            }).then(x => {
                setScanData('');
                setUser(null);
                setContainer(null);
                setNeto(0);
		         freezeNeto(false);
                setFinalStep(false);
                setIsSubmitAllowed(false);
                setmessage('');
            });

        }
        catch (error) {
            console.log(error);
        }
    }

    const updateBinWeightConfirm = async () => {
        try {
            const response = await axios.post('http://localhost:5001/UpdateBinWeight', {
                binId: rollingDoorId,
                neto: neto
            }).then(x => {
                setRollingDoorId(-1);
		setScanData('');
                setContainer(null);
                freezeNeto(false);
                setFinalStep(false);
                setIsSubmitAllowed(false);
            });

        }
        catch (error) {
            console.log(error);
        }
    }
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            if (user == null)
                handleScan();
            else if (isFinalStep) {
                if (container.waste.bin.filter(x => x.type_waste == wasteId).length < 1) {
                    alert("Mismatch Name: " + scanData);
                    return;
                }
                const scraplogid = await getidscraplog();
                if (scraplogid == null)
                {
                    alert("Scrap Log Id not found,cancelling process");
                    //return;
                }
                if (!(await saveTransaksi()))
                    return;
                updateBinWeight();
                UpdateStatusContainer();
                UpdateDataFromStep2();
                await sendDataPanasonicServer();
                
                await UpdateDataFromStep2ToPanasonic(scraplogid);
                await sendDataWeightPanasonicServer();
                setShowModalDone(true);
            }
            else {
                handleScan1();
            }
        }
    };

    const handleCancel = () => {
        toggleModal();
	freezeNeto(false);
    };
    const handleCancelConfirmModal = () => {
        setShowModalConfirmWeight(false);
        setFinalStep(true);
        //        updateBinWeight();
        //setWasteId(null);
    }

    const ConfirmModal = () => {
        setShowModalConfirmWeight(false);
        //updateBinWeightConfirm();
    };


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
                                </div >
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
                            </div >
                        </div >

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
            </Disclosure >
            <div className='bg-[#f4f6f9] p-5'>
                <div className="grid grid-cols-3 grid-flow-col gap-5">
                    <div className="row-span-2 col-span-2">
                        <div className='flex-1 p-4 border rounded bg-white'>
                            <h1 className='text-blue-600 font-semibold mb-2 text-xl'>Bruto</h1>
                            <div className=''>
                                <div className='flex-1 flex justify-center p-4 border rounded bg-gray-200 text-5xl font-semibold'>{Scales50Kg.weight50Kg}<FiRefreshCcw size={20} /></div>
                                <p className='flex justify-center text-2xl font-bold'>Kilogram</p>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-1 col-span-2">
                        <div className='flex-1 p-4 border rounded bg-white'>
                            <h1 className='text-blue-600 font-semibold mb-2 text-xl'>Neto</h1>
                            <div className=''>
                                <div className='flex-1 flex justify-center p-4 border rounded bg-gray-200 text-5xl font-semibold'>{neto} <FiRefreshCcw size={20} /></div>
                                <p className='flex justify-center text-2xl font-bold'>Kilogram</p>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-3">
                        <div className='flex-1 p-4 border rounded bg-white h-full'>
                            <h1 className='text-blue-600 font-semibold text-xl mb-3'>Scanner Result</h1>
                            <p>Scan Please</p>
                            <input
                                type="text"
                                autoFocus={true}
                                onChange={e => setScanData(e.target.value)}
                                value={scanData}
                                name="text"
                                onKeyDown={e => handleKeyPress(e)}
                                ref={inputRef}
                                className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=""
                            />
                            <button className='block w-full border rounded py-2 flex justify-center items-center font-bold mt-5 bg-sky-400 text-white text-lg' disabled={!isSubmitAllowed} onClick={toggleModal}>Submit</button>
                            <div className='text-lg mt-5'>
                                <p>Employee Name: {user?.username} </p>
                                <p>Container Id: {container?.name}</p>
                                <p>Waste: {container?.waste.name}</p>
                            </div>
                        </div>
                        </div>
                        
                </div>

            </div>
            <div className='flex justify-start'>
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                            <div className="bg-white rounded p-8 max-w-md mx-auto z-50">
                                <div className="text-center mb-4">

                                </div>
                                <form>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        {neto}Kg
                                    </Typography>
                                    <p>Data Timbangan Sudah Sesuai?</p>
                                    <div className="flex justify-center mt-5">
                                        <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-2 rounded">Ok</button>
                                        <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex justify-start'>
                {showModalConfirmWeight && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" onKeyDown={handleKeyPressModal}>
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                            <div className="bg-white rounded p-8 max-w-md mx-auto z-50">
                                <div className="text-center mb-4">
                                </div>
                                <form>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        <p>{rackname} Telah Dibuka!</p>
                                    </Typography>
                                    <div className="flex justify-center mt-5">
                                        <button type="button" autoFocus={true} onClick={()=>setShowModalConfirmWeight(false)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-2 rounded">Ok</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex justify-start'>
                {showModalDone && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                            <div className="bg-white rounded p-8 max-w-md mx-auto z-50">
                                <div className="text-center mb-4">
                                </div>
                                <form>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        <p>Data Telah Disimpan!</p>
                                    </Typography>
                                    <div className="flex justify-center mt-5">
                                        <button type="button" autoFocus={true} onClick={()=>setShowModalDone(false)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-2 rounded">Ok</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <p>Instruksi: {message}</p>
            <footer className='flex-1 rounded border flex justify-center gap-40 p-3 bg-white'  >
                <p>Server Status: 192.168.1.5 Online</p>
            </footer>
        </main >
    );
};

export default Home;
