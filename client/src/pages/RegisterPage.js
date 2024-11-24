import {useState} from 'react';

export default function RegisterPage(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    async function register(event){
        event.preventDefault();
        const response = await fetch('http://localhost:4000/register',{
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {'Content-Type':'application/json'},
        })
        if(response.status === 200){
            alert('registration successful')
        }else{
            alert('registration failed')
        }
    }
    return(
        <div className="container">
        <div className="form-container">
        <form className="register">
        <h1>Register Here...</h1>
            <input type="text" 
            placeholder="username"
            value={username}
            onChange={event => setUsername(event.target.value)}/>
            <input type="password" 
            placeholder="password"
            value={password}
            onChange={event => setPassword(event.target.value)}/>
            <button onClick={register}>Register</button>
        </form>
        </div>
        </div>
    );
}