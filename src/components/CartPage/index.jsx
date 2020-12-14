import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import Header from '../Header';
import MyProductItem from '../MyProductItem';
import img from './img/1.jpg';
import BuyBlock from '../BuyBlock';
import {connect} from 'react-redux';


const mapStateToProps = (state, ownProps) => {
    return {
        productList: state.cart.value,
    };
};

class CartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBought: false,
            value: 0,
            productList: [
                {
                    img,
                    title: 'Фруктовый салат',
                    text: 'Екатеринбург, Мира, 19',
                    price: '20.32',
                    id: 1,
                },
            ],
        };
    }

    componentDidMount() {
        const {productList} = this.props;
        const value = productList.reduce(
            (accumulator, currentValue) => {
                return accumulator + Number(currentValue.data.price) * Number(currentValue.quantity);
            }
            , 0);
        this.setState({
            value: value,
        });
    }

    handleBuy = () => {
        this.setState({
            isBought: true,
        });
        //...
    };

    render() {
        const {value, isBought} = this.state;
        const {productList} = this.props;
        return (
            <>
                {isBought && <Redirect push to="/cart/delivery"/>}
                <Header title="Корзина"></Header>
                {productList.map((item) => (
                    <MyProductItem
                        key={item.uuid}
                        img={img}
                        title={item.data.name}
                        text={item.data.merchant.address}
                        // price={`${item.data.price}x${item.quantity}`}
                        price={item.data.price}
                        quantity={item.quantity}
                        canEdit={false}
                    ></MyProductItem>
                ))}
                <BuyBlock
                    isBought={false}
                    total={value}
                    handleBuy={this.handleBuy}
                ></BuyBlock>
            </>
        );
    }

}

export default connect(mapStateToProps)(CartPage);