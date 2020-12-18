import React, {Component} from 'react';
import Header from '../Header';
import Products from '../Products';
import TableBlock from '../TableBlock';
import img from './1.jpg';
import BuyBlock from '../BuyBlock';
import axios from 'axios';
import URL from '../../utils/url';
import token from '../../utils/token';
import MakeConfig from '../../utils/AxiosConfig';
import Preloader from '../PreloaderMain';
import {connect} from 'react-redux';
import './style.scss';

const products = [
    {
        id: 1,
        title: 'Melon fruit salad',
        location: 'Yekaterinburg, Mira, 19',
        price: '$20,32',
        img: img,
        quantity: 1,
    },
    {
        id: 2,
        title: 'Melon fruit salad',
        location: 'Yekaterinburg, Mira, 19',
        price: '$20,32',
        img: img,
        quantity: 1,
    },
];

const mapStateToProps = (state, ownProps) => ({
    role: state.user.value.role,
});

class OrderDetails extends Component {
    constructor(props) {
        super(props);
        const match = props.match;
        this.state = {
            loaded: false,
            orderId: match.params.orderId || '0',
            order: {},
        }
    }

    componentDidMount() {
        const url = URL + 'api/get_orders/';
        const config = MakeConfig(token.get());
        axios.get(url, config)
            .then(resp => {
                this.setState({loaded: true, order: resp.data.filter(a => a.uuid === this.state.orderId)[0]});
                return axios.post(URL + 'api/get_delivery/', {order_uuid: this.state.orderId});
            })
            .then(resp => {
                console.log(resp.data);
            })
            .catch(err => console.error(err));
    }

    handleBack = () => {
        window.history.back();
    };

    handleCloseDeal = () => {
        const url = URL + 'api/update_order_status/';
        const config = MakeConfig(token.get());
        axios.patch(url,
            {uuid: this.state.orderId, status: 'closed'}, config);
    };

    render() {
        const {loaded, order} = this.state;
        const {role} = this.props;
        return loaded ? (
            <>
                <Header button={this.handleBack} title="Детали заказа"></Header>
                <Products products={order.products}></Products>
                {role === 'buyer' && (
                    <TableBlock
                        staticItems={['Дата отгрузки', 'Продавец', 'Адрес', 'Способ доставки', 'Способ оплаты']}
                        dynamicItems={[
                            (order.date || 'Неизвестно'),
                            (order.products[0].product.merchant.first_name || 'Имя') + ' ' + (order.products[0].product.merchant.last_name || 'Фамилия'),
                            (order.products[0].product.merchant.address || 'Уточняется у продавца'),
                            ('Самовывоз'),
                            ('Наличные'),
                        ]}
                        title="Детали доставки"
                    ></TableBlock>
                )}

                {role === 'seller' && (
                    <TableBlock
                        staticItems={['Дата отгрузки', 'Покупатель', 'Адрес', 'Способ доставки', 'Способ оплаты']}
                        dynamicItems={[
                            (order.date || 'Неизвестно'),
                            (order.products[0].product.merchant.first_name || 'Имя') + ' ' + (order.products[0].product.merchant.last_name || 'Фамилия'),
                            (order.products[0].product.merchant.address || 'Уточняется у покупателя'),
                            ('Самовывоз'),
                            ('Наличные'),
                        ]}
                        title="Детали доставки"
                    ></TableBlock>)}

                {order.status === 'opened' && role === 'seller' && (
                    <button className="order-details__button" onClick={this.handleCloseDeal}>
                        Закрыть сделку
                    </button>
                )}

                {order.status === 'closed' && role === 'seller' && (
                    <button className="order-details__button order-details__button-closed" disabled="disabled">
                        Сделка закрыта
                    </button>
                )}

            </>
        ) : <Preloader></Preloader>;
    }
}

export default connect(mapStateToProps)(OrderDetails);