import { faDonate } from '@fortawesome/free-solid-svg-icons';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


function Donate() {
    return (
        <>
            <div className='border-2 p-4 m-6'>
                <Tabs>
                    <TabList>
                        <Tab>Donate Money</Tab>
                        <Tab>Donate Materials</Tab>
                    </TabList>

                    <TabPanel>
                        <div className='flex flex-col md:flex-row md:space-x-16'>
                            <div className='w-full md:w-1/3'>
                                <img src='assets/donate_money.jpeg' className='w-30 h-15' alt='donate' />
                                <div className='my-2 '>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    Consectetur nam sed modi optio dolore omnis voluptas! Explicabo
                                    necessitatibus, sunt qui, voluptates expedita distinctio iusto ratione eligendi voluptas sint, blanditiis repudiandae.
                                </div>
                            </div>

                            <div className='w-full md:w-2/3'>

                                <div className='mx-2 mb-4 text-xl font-semibold'>Donate Now</div>
                                <div className='flex mb-3'>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>50 ETB</button>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>100 ETB</button>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>200 ETB</button>
                                </div>
                                <div className='flex mb-3'>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>500 ETB</button>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>1000 ETB</button>

                                </div>
                                <div className='flex mb-3'>
                                    <input type='number' className='flex w-full mx-2 h-10 border px-4' placeholder='Other amount in ETB' />
                                </div>
                                <div className='flex mb-3  mx-2 text-xl font-semibold'>Payment Options</div>
                                <div className='flex mb-3'>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>Telebirrr</button>
                                    <button className='flex-1 px-6 py-2 border bg-transparent hover:bg-green-700 hover:text-white mx-2'>CBE</button>
                                </div>
                                <button className="rounded-md border border-green-600 text-green-700 from-green-700 to-green-900  py-1 text-lg  px-3 hover:bg-gradient-to-l mx-2 hover:text-white"> Donate</button>


                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='flex flex-col md:flex-row md:space-x-16'>
                            <div className='w-full md:w-1/2'>
                                <img src='assets/donate_materials.jpg' className='w-30 h-15' alt='donate' />
                                <div className='my-2'>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    Consectetur nam sed modi optio dolore omnis voluptas! Explicabo
                                    necessitatibus, sunt qui, voluptates expedita distinctio iusto ratione eligendi voluptas sint, blanditiis repudiandae.
                                </div>
                            </div>

                            <div className='w-full md:w-1/2'>

                                <div className='mx-2 mb-4 text-xl font-semibold'>You can Donate Materials</div>
                                <div className='flex mb-3 mx-2'>
                                    Contact Us on: 09-00-00000
                                </div>


                                <div className='border-2 py-2'>
                                    <div className='flex mb-3  mx-2 text-xl font-semibold border-b-2 pb-1'>Message Us</div>
                                    <div className='flex mb-3'>
                                        <input type='text' className='flex w-full mx-2 h-10 border px-4' placeholder='Your Name' />

                                    </div>
                                    <div className='flex mb-3'>
                                        <input type='email' className='flex w-full mx-2 h-10 border px-4' placeholder='Your Email' />

                                    </div>

                                    <div className='flex mb-3'>
                                        <textarea type='text' rows={4} className='flex  w-full border-2 mt-2 p-1 outline-none focus:border-gray-300 mx-2' placeholder='Write additional note here' />

                                    </div>
                                    <button className="rounded-md border border-green-600 text-green-700 from-green-700 to-green-900  py-1 text-lg  px-3 hover:bg-gradient-to-l mx-2 hover:text-white"> Send</button>


                                </div>

                            </div>
                        </div>
                    </TabPanel>
                </Tabs>

            </div>
        </>
    );
}

export default Donate;