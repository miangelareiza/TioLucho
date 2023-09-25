import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiCube, BiUserPin, BiHomeAlt, BiMoneyWithdraw, BiCartDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';

// Styles
import '../styles/TabBar.css';

interface Props {
    tabOption: 'inventory' | 'clients' | 'home' | 'transactions' | 'invoice'
}

function TabBar({ tabOption }: Props) {    
    const { setIsLoading } = useAppStates();

    useEffect(() => {
        const opt = document.querySelector(`.tab_${tabOption}`) as HTMLAnchorElement;
        opt.click();        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabOption]);

    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
        let li = e.currentTarget.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;
        
        if (!ul.classList.contains('move') && !li.classList.contains('active')) {
            setIsLoading(true);
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
    }, [setIsLoading]);

    return(
        <div className='tabBar_container'>
            <ul className='tabBar'>
                <li>
                    <Link to='/home/inventory' onClick={handleClickOpt} className='tab_inventory'>
                        <div>
                            <BiCube />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/clients' onClick={handleClickOpt} className='tab_clients'>
                        <div>
                            <BiUserPin />
                        </div>
                    </Link>
                </li>
                <li className='active'>
                    <Link to='/home' onClick={handleClickOpt} className='tab_home'>
                        <div>
                            <BiHomeAlt />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/transactions' onClick={handleClickOpt} className='tab_transactions'>
                        <div>
                            <BiMoneyWithdraw />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/invoice' onClick={handleClickOpt} className='tab_invoice'>
                        <div>
                            <BiCartDownload />
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export { TabBar };