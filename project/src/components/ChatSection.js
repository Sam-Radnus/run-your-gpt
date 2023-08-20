import React,{useState,useEffect} from 'react';
import './styles/ChatSection.css';
import send from './send.svg';
import audio from './audio.svg';
import trash from './trash.svg';
import { Input } from 'dracula-ui'
import { useNavigate } from 'react-router-dom';
import 'react-awesome-button/dist/styles.css';
import './customButtonStyles.scss';
import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss';
import Loader from './Loader';
import './customButtonStyles.scss'
import '../App.css';
import {
    AwesomeButton,
    AwesomeButtonProgress,
    AwesomeButtonSocial,
  } from 'react-awesome-button';
const ChatSection = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [userInfo,setUserInfo]=useState({});
    const [promptsLeft,setPromptsLeft]=useState(25);
    const [disabled,setDisabled]=useState(false);
    const navigate=useNavigate();
   

 
    useEffect(() => {
     const data=JSON.parse(localStorage.getItem('userInfo'));
     const token=localStorage.getItem('token');
     if(data==null||token==null) navigate('/');
     fetchInfo();
     setUserInfo(data);
    }, [])
    const fetchInfo=async(token)=>{
        try {
            const token =localStorage.getItem('token');
            console.log(token);
            const response = await fetch('http://127.0.0.1:8000/api/user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            if(data){
                setPromptsLeft(data?.promptsLeft);
                if(data?.promptsLeft===0){
                   
                    setDisabled(true);
                };
            }
            else{
                navigate('/');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    const handleSend = async () => {
        if(disabled){
            return ;
        }
        setUserInput('');
        const currentTime = new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date()); // Client's local time
        if(userInput === '') return;
        setMessages([...messages,
        { type: 'user', text: userInput, timestamp: currentTime }
        ]);
        setIsLoading(true);
        const data=await sendMessage(userInput);
        if(data?.promptsLeft){
           setPromptsLeft(data.promptsLeft);
        }
        setIsLoading(false);
        if(data){
            fetchInfo();


           setMessages(prevMessages => [...prevMessages,
               { type: 'bot', text: data.response, timestamp: data.current_time }
           ]);
        }
        else{
            setMessages(prevMessages => [...prevMessages,
                { type: 'bot', text: "Some Error Occurred", timestamp: currentTime }
            ]);
        }
          
    }
    const sendMessage = async (message) => {
        const token=localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify({ prompt: message })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    
    return (
        <div> 
            { userInfo && 
            <section style={{ height: '100vh !important' }}>
                <div className="container py-5" >

                    <div style={{ height: "100vh" }} className="row d-flex justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-6">

                            <div className="card" style={{borderRadius:'20px'}} id="chat2">
                                <div style={{borderTopLeftRadius:'20px',borderTopRightRadius:'20px',background:'#F5F5F7'}} className="card-header d-flex justify-content-between align-items-center p-3">
                              
                                    {promptsLeft>0 ? <h5 className="mb-0">Prompts Left:{promptsLeft}</h5> :
                                       <h5 className="mb-0">You have ran out of prompts</h5> }
                                    <span onClick={()=>{
                                        setMessages([]);
                                    }}>
                                        <AwesomeButton   type="danger">
                                      <img src={trash} alt="Send Icon" />
                                    </AwesomeButton>
                                    &nbsp;
                                    <AwesomeButton onPress={(event, release) => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('userInfo');
                                        navigate('/');
                                      
                                     }}  type="danger" >Log Out</AwesomeButton>
                                    
                                    </span>
                                   
                                </div>
                                <span style={{marginTop:'10px',textAlign:'center',color:'grey'}}>welcome {userInfo?.username}</span>
                                <div  className="card-body" data-mdb-perfect-scrollbar="true" style={{height: "400px", overflow: "scroll" }}>
                                   
                                    {messages.map((message, index) => (
                                        <div key={index} style={{ position: "relative"}}  className={`d-flex flex-row ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                           { message.type==='user'?<></>:
                                            <img  src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
                                            alt="avatar 1" style={{ marginTop:"-5px",width: "45px", height: "100%" }} />
                                            }
                                            <p style={{ position:"relative",minWidth:'90px',minHeight:"50px",backgroundColor:`${message.type==='bot'?"#f5f6f7":"#FAE4CB"}`,fontWeight:"500"}} className={`small p-2 ${message.type === 'user' ? 'me-3' : 'ms-1'} rounded-3`}>
                                              {message.text}
                                              
                                              <small style={{position:"absolute",bottom:'0%',right:'5%',fontSize:'10px',marginTop:'10px'}} className="text-muted"> {message.timestamp}</small>
                                            </p>
                                           
                                        </div>
                                    ))}
                                    {isLoading && <Loader />}
                                </div>
                                <div id="move" style={{background:"#F5F5F7",borderTop:"none",borderBottomLeftRadius:'20px',borderBottomRightRadius:"20px"}} className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                                <Input color="white" size="lg" placeholder="Ask Away..." m="xs" style={{fontWeight:"500",backgroundColor:"#F1F1F1",width:"80%",marginRight:'10px'}} value={userInput} className="form-control form-control-lg" onChange={(e) => {
                                        setUserInput(e.target.value) }}/>
                                <span onClick={()=>{
                                    handleSend();
                                }}>
                                    <AwesomeButton disabled={disabled}  cssModule={AwesomeButtonStyles} type="primary"><img src={send} alt="Send Icon" /></AwesomeButton>
                                </span>
                                     &nbsp; 
                                    <AwesomeButton  disabled={disabled} cssModule={AwesomeButtonStyles} type="secondary"> <img src={audio} alt="Send Icon" /></AwesomeButton>
                                   
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
             }
        </div>
    );
}


export default ChatSection;



{/* <div className="d-flex flex-row justify-content-start">
                                        <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                        <div>
                                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>Hi</p>
                                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>How are you ...???
                                            </p>
                                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>What are you doing
                                                tomorrow? Can we come up a bar?</p>
                                            <p className="small ms-3 mb-3 rounded-3 text-muted">23:58</p>
                                        </div>
                                    </div>

                                    <div className="divider d-flex align-items-center mb-4">
                                        <p className="text-center mx-3 mb-0" style={{color:"#a2aab7"}}>Today</p>
                                    </div>

                                    <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                        <div>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Hiii, I'm good.</p>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">How are you doing?</p>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Long time no see! Tomorrow
                                                office. will
                                                be free on sunday.</p>
                                            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:06</p>
                                        </div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    </div>

                                    <div className="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }}/>
                                            <div>
                                                <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>Okay</p>
                                                <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>We will go on
                                                    Sunday?</p>
                                                <p className="small ms-3 mb-3 rounded-3 text-muted">00:07</p>
                                            </div>
                                    </div>

                                    <div className="d-flex flex-row justify-content-end mb-4">
                                        <div>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">That's awesome!</p>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">I will meet you Sandon Square
                                                sharp at
                                                10 AM</p>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Is that okay?</p>
                                            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:09</p>
                                        </div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    </div>

                                    <div className="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                        <div>
                                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>Okay i will meet
                                                you on
                                                Sandon Square</p>
                                            <p className="small ms-3 mb-3 rounded-3 text-muted">00:11</p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row justify-content-end mb-4">
                                        <div>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Do you have pictures of Matley
                                                Marriage?</p>
                                            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:11</p>
                                        </div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    </div>

                                    <div className="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
                                            alt="avatar 1" style={{ width:"45px", height: "100%" }} />
                                        <div>
                                            <p className="small p-2 ms-3 mb-1 rounded-3" style={{backgroundColor:"#f5f6f7"}}>Sorry I don't
                                                have. i
                                                changed my phone.</p>
                                            <p className="small ms-3 mb-3 rounded-3 text-muted">00:13</p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row justify-content-end">
                                        <div>
                                            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Okay then see you on sunday!!
                                            </p>
                                            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:15</p>
                                        </div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                            alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    </div> */}
