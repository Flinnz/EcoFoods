import React, { Component } from 'react';
import Header from '../Header';
import ProgressBar from '../ProgressBar';
import { Link } from 'react-router-dom';
import './style.scss';
import { connect } from 'react-redux';
import { formOrdersFromCartWithDelivery } from '../../store/actionCreators/cartActionCreators';
import { setDeliveryInfo, setDeliveryPayment } from '../../store/actionCreators/deliveryActionCreators';

const mapStateToProps = (state, ownProps) => ({
    fullAddress: state.delivery.value.delivery.address,
    endDate: state.delivery.value.delivery.end_date,
    deliveryType: state.delivery.value.delivery.type,
});

const mapDispatchToProps = (dispatch) => ({
    formOrdersFromCartWithDelivery: () => dispatch(formOrdersFromCartWithDelivery()),
    setDeliveryInfo: (info) => dispatch(setDeliveryInfo(info)),
});

class DeliveryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deliveryType: props.deliveryType || '',
            endDate: props.endDate || '',
            city: '',
            street: '',
            house: '',
            apartment: '',
            additional: '',
            fullAddress: props.fullAddress || '',
        };
    }

    handleBack = () => {
        window.history.back();
    };

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        const points = ['Корзина', 'Доставка', 'Оплата'];
        const { deliveryType } = this.state;
        return (
            <>
                <Header button={this.handleBack} title="Доставка"></Header>
                <ProgressBar points={points} step={1}></ProgressBar>
                <main className="delivery">
                    <h2 className="h2">Выберите способ доставки</h2>
                    <select
                        name={'deliveryType'}
                        value={this.state.deliveryType}
                        onChange={this.handleChange}
                        className="delivery__input"
                    >
                        <option value="">Не выбранно</option>
                        <option value="delivery">Доставка от продавца</option>
                        <option value="pickup">Cамовывоз</option>
                    </select>
                    {deliveryType && (
                        <>
                            <input
                                className="delivery__input"
                                name="endDate"
                                value={this.state.endDate}
                                onChange={this.handleChange}
                                type="date"
                            ></input>
                        </>
                    )}
                    {deliveryType === 'delivery' && (
                        <>
                            <h2 className="h2">Время доставки</h2>
                            <select className="delivery__input">
                                <option value="">С 7:00 до 8:00</option>
                                <option value="">С 8:00 до 9:00</option>
                                <option value="">С 9:00 до 10:00</option>
                                <option value="">С 10:00 до 11:00</option>
                                <option value="">С 11:00 до 12:00</option>
                                <option value="">С 12:00 до 13:00</option>
                                <option value="">С 13:00 до 14:00</option>
                            </select>
                            <h2 className="h2">Город</h2>
                            <input name={'city'} onChange={this.handleChange} type="text" className="delivery__input" value={this.state.city}/>
                            <h2 className="h2">Улица</h2>
                            <input name={'street'} onChange={this.handleChange} type="text" className="delivery__input" value={this.state.street}/>
                            <h2 className="h2">Дом</h2>
                            <input name={'house'} onChange={this.handleChange} type="text" className="delivery__input" value={this.state.house}/>
                            <h2 className="h2">Кв./Офис</h2>
                            <input name={'apartment'} onChange={this.handleChange} type="text" className="delivery__input" value={this.state.apartment}/>
                            <h2 className="h2">Доп. информация</h2>
                            <input name={'additional'} onChange={this.handleChange} type="text" className="delivery__input" value={this.state.additional}/>
                        </>
                    )}
                    {deliveryType === 'pickup' && (
                        <>
                            <h2 className="h2">Время самовывоза</h2>
                            <select className="delivery__input">
                                <option value="">С 7:00 до 8:00</option>
                                <option value="">С 8:00 до 9:00</option>
                                <option value="">С 9:00 до 10:00</option>
                                <option value="">С 10:00 до 11:00</option>
                                <option value="">С 11:00 до 12:00</option>
                                <option value="">С 12:00 до 13:00</option>
                                <option value="">С 13:00 до 14:00</option>
                            </select>
                            <h2 className="h2">Самовывоз из</h2>
                            <input value={this.state.fullAddress} onChange={(e) => e.preventDefault()} type="text" className="delivery__input" />
                        </>
                    )}
                    {deliveryType && (
                        <Link to="/cart/payment">
                            <button onClick={() => this.props.setDeliveryInfo({
                                type: this.state.deliveryType,
                                address: this.state.deliveryType === 'pickup' 
                                    ? this.state.fullAddress 
                                    : `Город ${this.state.city}, улица ${this.state.street}, дом ${this.state.house}, квартира ${this.state.apartment}, ${this.state.additional}`,
                                time_start: new Date().toISOString(),
                                time_end: new Date(this.state.endDate).toISOString(),
                            })} className="delivery__button">
                                Перейти к оплате
                            </button>
                        </Link>
                    )}
                </main>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryPage);