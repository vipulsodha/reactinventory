import React from 'react';
import {Link} from 'react-router';


export default class SideBarElem extends React.Component {

    constructor(props) {
        super(props);
        this.isVisible = this.isVisible.bind(this);
        this.getSublist = this.getSublist.bind(this);
        this.toggleSubList = this.toggleSubList.bind(this);
        this.state = {};
        this.state.subListVisible = false;
    }

    isVisible() {
           return 'transition-visibility '+((!this.state.subListVisible) ?'display-none':'');
    }

    toggleSubList() {
        this.setState({subListVisible: !this.state.subListVisible});        
    }

    componentWillMount() {
        if(this.props.defaultOpen) {
            this.setState({subListVisible: true});
        }
    }

    getSublist() {
        let temp = this.props.subList.map((elem, index) => {
            return (
                    <Link to = {elem.link} key={index} activeClassName = "sidebar-link-active" onlyActiveOnIndex={false}><li className="side-bar-sub-elem" key = {index}>{elem.key}</li></Link>
                )
        });
        return temp;
    }

    render() {
        return (
          <div className="side-bar-elem">
            {this.props.giveHeaderLink ?
                <Link to={this.props.link} activeClassName = "sidebar-link-active" onlyActiveOnIndex={true}><span onClick={this.toggleSubList} className="cusor-pointer"><i className={this.props.icon}></i>&nbsp;&nbsp;{this.props.listHeader}</span></Link>
                :
                <span onClick={this.toggleSubList} className="cusor-pointer"><i className={this.props.icon}></i>&nbsp;&nbsp;{this.props.listHeader}
                    {
                        this.state.subListVisible?
                            <i className="glyphicon glyphicon-chevron-down float-right"></i>
                            :
                            <i className="glyphicon glyphicon-chevron-right float-right"></i>
                    }
                </span>
            }
                <ul className = {this.isVisible()}>
                    {this.getSublist()}
                </ul>
            </div>
        )
    }
}
