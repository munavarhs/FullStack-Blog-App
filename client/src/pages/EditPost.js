import { useState,useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from 'react-router-dom';

const modules = {
    toolbar : [
    [{'header':[1,2,false]}],
    ['bold', 'italic', 'underline','strike','blockquote'], 
    [{ 'list': 'ordered' }, { 'list': 'bullet' },{'indent':-1}], 
    ['link', 'image'],
    ['clean']
    ]
};
  
  const formats = [
    'bold', 'italic', 'underline', 'strike', // Text styles
    'blockquote', 'code-block',             // Blocks
    'header',                               // Headers
    'list', 'bullet', 'indent',             // Lists and Indents
    'link', 'image',                        // Media
    'align',                                // Alignment
    'color', 'background'                   // Text colors and background
  ];
export default function EditPost(){
    const {id} = useParams();
    const[title, setTitle] = useState('');
    const[summary, setSummary] = useState('');
    const[content, setContent] = useState('');
    const[files, setFiles] = useState('');
    const[redirect, setRedirect] = useState(false);

    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`)
        .then(response=>{
            response.json().then(postInfo=>{
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            })
        })
    },[])
    async function updatePost(event){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file',files?.[0]);
        }
        event.preventDefault();
        const response = await fetch('http://localhost:4000/post',{
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            setRedirect(true);
        }
    }
    if(redirect){
        return <Navigate to ={'/post/'+id} />
    }
    return(
        <form onSubmit={updatePost}>
            <input type="text" 
            placeholder={'Title'} 
            value={title}
            onChange={ev=>setTitle(ev.target.value)}/>
            <input type ="summary" 
            placeholder={'Summary'}
            value={summary}
            onChange={ev=>setSummary(ev.target.value)}/>
            <input type="file" 
            onChange={ev=>setFiles(ev.target.files)}/>
            <ReactQuill 
            value={content} 
            modules={modules} 
            formats={formats}
            onChange={newValue => setContent(newValue)}
            style={{backgroundColor:'#fff'}}/>
            <button style={{marginTop:'5px'}}>Update post</button>
        </form>
    )
}