import React from 'react';


export default class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.value = this.props.defaultValue || "";
        if(this.props.autoCompleteList && this.props.autoCompleteList.length > 0 ) {
            this.state.list = [...this.props.autoCompleteList];
        } else {
            this.state.list = [];
        }
        this.state.valueId  = this.props.defaultValueId || '';
        this.state.autoCompleteOpen = false;
        this.state.showSearch = this.props.showSearch || true;
        this.state.label = this.props.label || "";
        this.onItemSelect = this.onItemSelect.bind(this);
        this.toggleAutoComplete = this.toggleAutoComplete.bind(this);
        this.getOpenCloseClass = this.getOpenCloseClass.bind(this);
        this.closeAutoComplete = this.closeAutoComplete.bind(this);
        this.filterList = this.filterList.bind(this);
    }

    getAutoCompleteList(list) {
        let temp = list.map((elem, index) => {
            return (
                <li value={elem.id} key={index} onClick={this.onItemSelect} data-index={index}>{elem.value}</li>
            )
        });
        return temp;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("Props receicing");
    //
    //     if(nextProps.defaultValueId != this.props.defaultValueId) {
    //         this.setState({valueId: nextProps.defaultValueId,value:nextProps.defaultValue });
    //     }
    // }

    onItemSelect(e) {
        let value = e.target.innerHTML;
        let valueId = e.target.value;
        let elemIndex = this.props.elemIndex || 0;
        let  index = e.target.attributes["data-index"].value;
        this.setState({value: value, valueId: valueId, autoCompleteOpen: false});
        this.props.onSelect({value: value, id: valueId, index:index , elemIndex:elemIndex});
    }

    toggleAutoComplete(e) {

        this.setState({autoCompleteOpen: !this.state.autoCompleteOpen});
    }

    closeAutoComplete() {
        this.setState({autoCompleteOpen: false});
    }

    getOpenCloseClass() {
        return "floating-div " + ((this.state.autoCompleteOpen) ? '': 'display-none');
    }
    componentDidMount() {
        // document.body.addEventListener('click', this.closeAutoComplete);
    }

    componentWillUnmount() {
        // document.body.removeEventListener('click', this.closeAutoComplete);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.autoCompleteList && nextProps.autoCompleteList.length > 0) {
            this.setState({list: [...nextProps.autoCompleteList]});
        }

            if(nextProps.defaultValueId != this.props.defaultValueId) {
                this.setState({valueId: nextProps.defaultValueId, value:nextProps.defaultValue });
            }

        // if(nextProps.autoCompleteList.length > 0) {
        //     this.setState({list: [...nextProps.autoCompleteList]});
        // }
    }

    filterList(e) {

        let filterKey = e.target.value.trim();
        if(filterKey.length == 0) {
            this.setState({list: [...this.props.autoCompleteList]});
            return;
        }
        let regex = new RegExp(filterKey, 'gi');
        let temp = this.props.autoCompleteList.filter((elem) => {

                return elem.value.match(regex);
            });

        this.setState({list: temp});
    }

    render() {

        return (
            <div className="form-group">
                <label>{this.state.label}</label>
                <div className="auto-complete-div cusor-pointer">
                    <span className = "auto-complete-value" onClick={this.toggleAutoComplete}><span className="inner-span-value truncate">{this.state.value}</span><i className="glyphicon glyphicon-chevron-down autocomplete-down-icon"></i></span>
                    <div className={this.getOpenCloseClass()}>
                        {
                            this.state.showSearch?
                                <input type="text" className="form-control" onChange={this.filterList} placeholder="search.."/>:''
                        }
                        <ul>
                            {this.getAutoCompleteList(this.state.list)}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}




