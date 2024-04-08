import React, { useState } from 'react'
import {Link} from 'react-router-dom';
import '../styles/Header.css'
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../actions/UserAction';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';



  

function translateAndSearch() {
    const indicTextInput = document.getElementById('indicTextInput').value;
    fetch('/translate_and_search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'indic_text_input': indicTextInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('indicText').innerText = `Input (Indic): ${data.indic_text_input}`;
        document.getElementById('englishTranslation').innerText = `Translated to English: ${data.english_translation}`;
        document.getElementById('backendResult').innerText = `Backend Processing Result: ${data.backend_processing_result}`;
        document.getElementById('indicOutput').innerText = `Output (Indic): ${data.indic_output}`;

        // Display matched products
        const matchedProductsList = document.getElementById('matchedProducts');
        matchedProductsList.innerHTML = ''; // Clear previous results

        if (data.matched_products.length > 0) {
            data.matched_products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.innerText = product.name; // Assuming 'name' is the product field to display
                matchedProductsList.appendChild(listItem);
            });
        } else {
            const noMatchMessage = document.createElement('li');
            noMatchMessage.innerText = 'No matched products found.';
            matchedProductsList.appendChild(noMatchMessage);
        }
    });
}

const Header = (props) => {

    const dispatch = useDispatch();

    const [dropdown, setDropDown] = useState(false);
    const [secondDropdown, setSecondDropdown] = useState(false);


    const showDropDown = () =>{
        if(dropdown) setDropDown(false);
        else setDropDown(true);
    }

    const showSecondDropDown = () =>{
        if(secondDropdown) setSecondDropdown(false);
        else setSecondDropdown(true);
    }


    const cart = useSelector((state) => state.cart);
    const {cartItems} = cart;


    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const signOutHandler = () =>{
        dispatch(signout());
    }

    const [query, setQuery] = useState('');

    console.log(userInfo)

    return (
        <header>
            <div className="container">
                <div className="inner-content">
                    <div className="brand">
                        <Link to="/">Pappi</Link>
                    </div>

                    <div className="search-bar">
                        <input className="search-input"
                        onChange={(e)=> setQuery(e.target.value)}
                        placeholder="Search products"
                        value={query}>
                         </input>
                    

                        <div className="search-btn">
                            <Link to={`/searchresults/${query}`}>
                                <SearchIcon/>
                            </Link>
                        </div>
                        
                    </div>
                    <div className='translate'>
                    <textarea  className="Translate"id="indicTextInput" placeholder="Enter text in an Indic language"></textarea>
                    <div className='button'>
                    <button onclick={translateAndSearch}>Translate & Search</button>
                    </div>
                     <div id="outputContainer">
                        <p id="indicText"></p>
                        <p id="englishTranslation"></p>
                         <p id="backendResult"></p>
                        <p id="indicOutput"></p>
                        <ul id="matchedProducts"></ul> 
                     </div>

                    </div>
                    <button onclick="startVoiceTranslation()">Start Voice Translation</button>

                    <div id="app"></div>


                    <ul className="nav-links">
                        <li>
                            <Link to="/cart"><ShoppingCartIcon/>
                                {
                                    cartItems.length > 0 && 
                                    (<p className="badge">{cartItems.length}</p>)
                                }
                            </Link>
                        </li>
                        <li>
                            {
                                userInfo ? (
                                    <div className="header-dropdown">
                                        
                                        <p onClick={showDropDown}>
                                            {userInfo.name}
                                            <ArrowDropDownIcon/>
                                        </p>

                                        <ul className={ dropdown? 'dropdown-content show' : 'dropdown-content'}>
                                            <li>
                                               <Link to="/profile">Account</Link> 
                                            </li>
                                            <li>
                                               <Link to="/orderhistory">Order History</Link> 
                                            </li>
                                            <li>
                                               <Link to="/" onClick={signOutHandler}>Sign out</Link> 
                                            </li>
                                        </ul>
                                    </div>
                                    
                                ) :
                                (
                                    <Link to="/signin"><AccountCircleIcon/></Link>
                                )
                            }
                            
                        </li>

                        {userInfo && userInfo.isAdmin && (
                            <li>
                                <div className="header-dropdown">
                                    <p onClick={showSecondDropDown}>
                                        Admin 
                                        <ArrowDropDownIcon/>
                                    </p>
                            
                                    <ul className={ secondDropdown? 'dropdown-content show' : 'dropdown-content'}>
                                        
                                        <li>
                                           <Link to="/productlist">Products</Link> 
                                        </li>
                                          
                                    </ul>
                                </div>
                            </li>
                        )}
                        
                            
                    </ul>
                </div>

                <div className="category-container">
                    <ul>
                        <li><Link to="/category/mobile">Mobile</Link></li>
                        <li><Link to="/category/laptop">Laptop</Link></li>
                        <li><Link to="/category/monitor">Monitor</Link></li>
                        <li><Link to="/category/accessories">Computer Accessories</Link></li>
                        <li><Link to="/category/earphones">Earphones</Link></li>
                    </ul>
                </div>
            </div>
            <script src='P:\Amazon-Clone-master\Amazon-Clone-master\amazon-backend\app1.js'> </script>
        </header>
    )
}

export default Header
