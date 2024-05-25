import React, { useEffect, useRef, useState } from 'react'
import style from './ProductPage.module.css'
export default function ProductPage() {
    useEffect(() => {
        fetchProduct('https://fakestoreapi.com/products');
    }, [])
    const [state, setState] = useState([]);
    const [categories, setCategories] = useState([]);
    const [apiurl, setApiurl] = useState('')
    const [copyState, setCopystate] = useState([])
    let timer=useRef(null);
    const fetchProduct = (url) => {
        setApiurl(url)
        fetch(`${url}`)
            .then(res => res.json())
            .then((res) => {
                setState(res)
                setCopystate(res)
            })
            .catch(err => console.log(err))
        

            fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=>setCategories(json))
            .catch(err=>console.log(err))
    }
    const sortProduct=(value)=>{
        if(value=="lh"){
            setState([...state.sort((a,b)=>a.price-b.price)]);
        }else if(value=="hl"){
            setState([...state.sort((a,b)=>b.price-a.price)]);
        }else if(value=="az"){
            setState([...state.sort((a,b)=>a.title.localeCompare(b.title))]);
        }else if(value=="za"){
            setState([...state.sort((a,b)=>b.title.localeCompare(a.title))]);
        }else{
            fetchProduct(apiurl)
        }
    }
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Product Page</h1>
            <div style={{ width: "80%", margin: "auto" }}>
                <input placeholder='Search Product' style={{ width: "100%", margin: "auto", fontSize:"20px",padding:'12px' }} onInput={(e)=>{
                    if(timer.current){
                        clearTimeout(timer.current)
                    }
                    timer.current=setTimeout(() => {
                        // console.log(e.target.value)
                        // console.log(state.filter(el=>el.title.toLowerCase().includes(e.target.value.toLowerCase())))
                        setState([...copyState.filter(el=>el.title.toLowerCase().includes(e.target.value.toLowerCase()))])
                    },300)
                }} />
            </div>
            <div style={{display:'flex',justifyContent:"space-between",marginTop:"20px",paddingLeft:'15px',paddingRight:"15px"}}>
            <select onChange={(e)=>{
                if(e.target.value){
                    fetchProduct(`https://fakestoreapi.com/products/category/${e.target.value}`)
                }else{
                    fetchProduct('https://fakestoreapi.com/products');
                }
            }}>
                <option value="">Select Categories</option>
                {
                    categories.length>0 ? 
                    categories.map((el,i)=>{
                        return <option key={i} value={el}>{el}</option>
                    })
                    :<></>
                }
            </select>
            <select onChange={(e)=>{sortProduct(e.target.value)}}>
                <option value="">Sorting</option>
                <option value="lh">Price : Low - High</option>
                <option value="hl">Price : High - Low</option>
                <option value="az">Name : A - Z</option>
                <option value="za">Name : Z - A</option>
            </select>
            </div>
            <div className={`${style.productContainer}`}>
                {
                    state.length > 0 ?
                        state.map((el, i) => {
                            return <div key={i} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                                <img src={`${el.image}`} style={{ width: '100%', height: "350px" }} />
                                <h3 style={{ textAlign: 'center' }}>{el.title}</h3>
                                <h4 style={{ textAlign: 'center' }}>{`Price : $ ${el.price}`}</h4>
                                <h4 style={{ textAlign: 'center' }}>{`Rating :  ${el.rating.rate}`} &#9734;</h4>
                                <button style={{ width: '100%' }}>Buy Now</button>
                            </div>
                        })
                        : <></>
                }

            </div>
        </div>
    )
}
