import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Picker,
  StyleSheet,
  Modal,
  Text,
  Platform
} from 'react-native';

class NativePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: props.selectedValue || props.items[0].value,
      modalVisible: false,
      items: props.items,
    };

    if (props.selectedValue) {
      let selectedItem = this.getSelectedItem(this.state.selectedValue);
      if (selectedItem) {
        this.state.label = selectedItem.label;
      }
    }
  }

  getSelectedItem(valueToFilter) {
    let selectedItem = this.state.items.filter((item) => {
      return item.value === valueToFilter;
    });
    if (selectedItem && selectedItem.length) {
      return selectedItem[0];
    } else {
      return null;
    }
  }

  filterSelected(item) {
    return item.value === this.state.selectedValue;
  }

  onValueChange(itemValue) {
    this.setState({
      selectedValue: itemValue,
      modalVisible : false,
      label: ( this.getSelectedItem(itemValue) || {} ).label,
    });

    if (this.props.onValueChange){
      this.props.onValueChange(itemValue);
    }
  }

  setModalVisibility(modalVisible) {
    this.setState({modalVisible : modalVisible});
  }

  confirm() {
    this.onValueChange(this.state.selectedValue);
  }

  renderItens() {
    return this.state.items.map((item, i) => {
      return <Picker.Item key={i} label={item.label} value={item.value}  />;
    });
  }

  renderText() {
    let textStyle = [this.props.textStyle];
    if (this.props.disabled) {
      textStyle.push({ opacity: 0.5 });
    }

    return <Text style={textStyle}>{this.state.label || this.props.placeholderText}</Text>;
  }

  renderIOS() {
    return  <View >
              <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}  >
                <View style={styles.viewTransparent} />
                <View style={styles.viewPicker}>
                  <View style={styles.viewButtons}>
                    <TouchableOpacity onPress={() => { this.setModalVisibility(false); }}>
                      <Text style={this.props.btCancel || styles.btCancel} > {this.props.cancelText} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => { this.confirm(); }}>
                      <Text style={this.props.btConfirm || styles.btConfirm} > {this.props.confirmText} </Text>
                    </TouchableOpacity>
                  </View>
                  <Picker selectedValue={this.state.selectedValue}
                          onValueChange={(itemValue, itemIndex) => {this.onValueChange(itemValue, itemIndex);}} >
                    {this.renderItens()}
                  </Picker>
               </View>
              </Modal>
              <TouchableOpacity disabled={this.props.disabled} onPress={() => { this.setModalVisibility(true); }}>
                {this.renderText()}
              </TouchableOpacity>
          </View>;
  }

  renderAndroid() {
    return  <View>
              <Picker selectedValue={this.state.selectedValue}
                  style={styles.pickerAndroid}
                  enabled={!this.props.disabled}
                  onValueChange={(itemValue, itemIndex) => {this.onValueChange(itemValue, itemIndex);}} >
                {this.renderItens()}
              </Picker>
              {this.renderText()}
            </View>;
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid();
  }
}

PratPicker.propTypes = {
  items: React.PropTypes.array.isRequired,
  disabled: React.PropTypes.bool,
  onValueChange: React.PropTypes.func,
  selectedValue: React.PropTypes.string,
  cancelText: React.PropTypes.string,
  confirmText: React.PropTypes.string,
  placeholderText: React.PropTypes.string,
};

PratPicker.defaultProps = {
  disabled: false,
  selectedValue: null,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  placeholderText: 'Select',
};

export default PratPicker;

const styles = StyleSheet.create({
  viewTransparent:{
    flex: 1,
    backgroundColor: '#00000077'
  },
  viewPicker: {
    backgroundColor: '#ddd',
    height: 200,
  },
  pickerAndroid: {
    opacity: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    position:'absolute'
  },
  viewButtons: {
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth: 1,
    borderBottomColor:'#bbb',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  btCancel: {
    color:'#666'
  },
  btConfirm: {
    color:'#3566a8'
  }
});
