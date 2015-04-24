'use strict';

var $ = require('jquery'); // excluded and shimed

var React = require('react/addons');
var BootstrapModal = require('../bootstrap/BootstrapModal');
var TextField = require('./TextField');
var NumberField = require('./NumberField');
var BooleanField = require('./BooleanField');
var DropdownField = require('./DropdownField');
var $ = require('jquery'); // excluded and shimed

var ConfigurationForm = React.createClass({
    getDefaultProps() {
        return {
            values: {},
            includeTitleField: true
        };
    },
    _copyStateFromProps(props) {
        return {
            configFields: $.extend({}, props.configFields),
            title: props.title,
            typeName: props.typeName,
            formId: props.formId,
            submitAction: props.submitAction,
            helpBlock: props.helpBlock,
            values: $.extend({}, props.values),
            titleValue: props.titleValue,
            includeTitleField: props.includeTitleField
        };
    },
    getInitialState() {
        return this._copyStateFromProps(this.props);
    },
    componentWillMount() {
        this.setState({values: $.extend({}, this.props.values)});
    },
	componentWillReceiveProps(props) {
		this.setState(this._copyStateFromProps(props));
	},
    render() {
        var typeName = this.state.typeName;
        var configFields = $.map(this.state.configFields, this._renderConfigField);
        var title = this.state.title;
        var helpBlock = this.state.helpBlock;
        var header = (
            <h2 className="modal-title">
                <i className="fa fa-signin"></i>
                {title}
            </h2>
        );

        var titleField = {is_optional: false, attributes: [], human_name: "Title", description: helpBlock};
        var titleElement = (this.state.includeTitleField ? <TextField key={typeName + "-title"} typeName={typeName} title="title"
                                      field={titleField} value={this.state.titleValue} onChange={this._handleTitleChange}/> : "");

        var body = (
            <fieldset>
                <input type="hidden" name="type" value={typeName} />

                {titleElement}
                {configFields}
            </fieldset>
        );
        return (
            <BootstrapModal ref="modal" onCancel={this._closeModal} onConfirm={this._save} cancel="Cancel" confirm="Save">
                {header}
                {body}
            </BootstrapModal>
        );
    },
    _save(evt) {
        var values = this.state.values;
        var data = {title: this.state.titleValue,
            type: this.state.typeName,
            configuration: {}};
        $.map(this.state.configFields, function(field, name) {
            data.configuration[name] = (values[name] || field.default_value);
        });
        this.props.submitAction(data);
        this.refs.modal.close();
    },
    open() {
        this.refs.modal.open();
    },
    _closeModal() {
        this.refs.modal.close();
        if (this.props.cancelAction) {
            this.props.cancelAction();
        }
    },
    _handleTitleChange(field, value) {
        this.setState({titleValue: value});
    },
    _handleChange(field, value) {
        var values = this.state.values;
        values[field] = value;
        this.setState({values: values});
    },
    _renderConfigField(configField, key) {
        var value = this.state.values[key];
        switch(configField.type) {
            case "text":
                return (<TextField key={this.state.typeName + "-" + key} typeName={this.state.typeName} title={key} field={configField} value={value} onChange={this._handleChange}/>);
            case "number":
                return (<NumberField key={this.state.typeName + "-" + key} typeName={this.state.typeName} title={key} field={configField} value={value} onChange={this._handleChange}/>);
            case "boolean":
                return (<BooleanField key={this.state.typeName + "-" + key} typeName={this.state.typeName} title={key} field={configField} value={value} onChange={this._handleChange}/>);
            case "dropdown":
                return (<DropdownField key={this.state.typeName + "-" + key} typeName={this.state.typeName} title={key} field={configField} value={value} onChange={this._handleChange}/>);
        }
    }
});

module.exports = ConfigurationForm;
