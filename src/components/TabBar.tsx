import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiCube, BiUserPin, BiHomeAlt, BiMoneyWithdraw, BiCartDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';

// Styles
import '../styles/TabBar.css';

interface Props {
    tabOption: 'inventory' | 'clients' | 'home' | 'transactions' | 'sale' | 'admin'
}

function TabBar({ tabOption }: Props) {    
    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();
    
    const animationMove = useCallback((ul: HTMLUListElement, li: HTMLLIElement) => {
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

    useEffect(() => {
        const opt = document.querySelector(`.tab_${tabOption}`) as HTMLAnchorElement;
        let li = opt.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;
        animationMove(ul, li);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabOption]);

    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        let li = e.currentTarget.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;
        animationMove(ul, li);
    };

    return(
        <div className='tabBar_container'>
            <ul className='tabBar'>
                <li>
                    <Link to='/home/myInventory' onClick={handleClickOpt} className='tab_inventory'>
                        <div>
                            <BiCube />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/myClients' onClick={handleClickOpt} className='tab_clients'>
                        <div>
                            <BiUserPin />
                        </div>
                    </Link>
                </li>
                <li className='active'>
                    <Link to='/home' onClick={handleClickOpt} className='tab_home tab_admin' onDoubleClick={()=>navigate('/home/admin')}>
                        <div>
                            <BiHomeAlt />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/MyTransactions' onClick={handleClickOpt} className='tab_transactions'>
                        <div>
                            <BiMoneyWithdraw />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/newSale' onClick={handleClickOpt} className='tab_sale'>
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