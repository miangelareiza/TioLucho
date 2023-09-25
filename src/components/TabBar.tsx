// import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHome, BiMoneyWithdraw, BiUser } from 'react-icons/bi';
import { BsBox, BsBox2, BsBoxSeam } from 'react-icons/bs';

// Components

// Styles
import '../styles/TabBar.css';

function TabBar() {    
    
    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = (e) => {        
        let li = e.currentTarget.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;

        if (!ul.classList.contains('move') && !li.classList.contains('active')) {
            Array.from(ul.children).forEach( child => {
                child.classList.remove('active');
            });

            ul.style.setProperty('--x-n', li.offsetLeft + li.offsetWidth / 2 + 'px');
            li.classList.add('move');
            ul.classList.add('move');

            setTimeout(() => {
                li.classList.add('active');
                setTimeout(() => {
                    ul.classList.remove('move');
                    li.classList.remove('move');
                    ul.style.setProperty('--x', li.offsetLeft + li.offsetWidth / 2 + 'px');
                }, 300);
            }, 900);
        }        
    }

    return(
        <div className='tabBar_container'>
            <ul className='tabBar'>
                <li>
                    <Link to='#' onClick={handleClickOpt}>
                        <div>
                            <BsBox2 />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={handleClickOpt}>
                        <div>
                            <BiUser />
                        </div>
                    </Link>
                </li>
                <li className='active'>
                    <Link to='#' onClick={handleClickOpt}>
                        <div>
                            <BiHome />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={handleClickOpt}>
                        <div>
                            <BiMoneyWithdraw />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='#' onClick={handleClickOpt}>
                        <div>
                            <BiMoneyWithdraw />
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export { TabBar };