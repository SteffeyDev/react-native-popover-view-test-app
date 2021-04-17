import React, {Component} from 'react';
import { SafeAreaView, TextInput, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Switch, Platform, StatusBar, Alert, I18nManager } from 'react-native';
import Popover, { Rect, Size, PopoverPlacement, PopoverMode } from 'react-native-popover-view';

class PopoverTestContent extends React.Component {
  state = {
    contentWidth: null,
    contentWidthWorking: '250',
    contentHeight: 250,
    contentHeightWorking: '250'
  }

  render() {
    return (
      <ScrollView style={{width: this.state.contentWidth, flex: 1, height: null/* this.state.contentHeight*/}} contentContainerStyle={[StyleSheet.flatten(styles.popoverContent), {height: this.state.contentHeight}]}>
        <Text style={{color: this.props.dark ? 'white' : 'black'}}>{this.props.contentText}</Text>
        <View style={{borderColor: 'gray', borderWidth: 2, padding: 10, marginTop: 10}}>
          <Text style={{marginBottom: 10, textAlign: 'center', color: this.props.dark ? 'white' : 'black'}}>Adjust Content Size</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={{justifyContent: 'center', color: this.props.dark ? 'white' : 'black'}}>Width: </Text>
            <TextInput 
              style={[styles.textInput, {color: this.props.dark ? 'white' : 'black'}]} 
              onSubmitEditing={() => this.setState({contentWidth: Math.max(200, parseInt(this.state.contentWidthWorking))})} 
              onChangeText={width => this.setState({contentWidthWorking: width})} 
              value={this.state.contentWidthWorking} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: this.props.dark ? 'white' : 'black'}}>Height: </Text>
            <TextInput 
              style={[styles.textInput, {color: this.props.dark ? 'white' : 'black'}]} 
              onSubmitEditing={() => this.setState({contentHeight: Math.max(200, parseInt(this.state.contentHeightWorking))})} 
              onChangeText={height => this.setState({contentHeightWorking: height})} 
              value={this.state.contentHeightWorking} />
          </View>
        </View>
        <View style={{height: 0, width: 10, backgroundColor: 'black'}} />
      </ScrollView>
    )
  }
}

class TouchablePopover extends React.Component {
  state = {
    show: false
  }
  touchable = React.createRef();

  componentDidMount() {
    // not currently used, but can be enabled for testing usage with isVisible initially being true
    if (this.props.showInitially)
      this.setState({show: true});
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity ref={this.touchable} style={this.props.smallButton ? styles.smallButton : (this.props.superLargeButton ? styles.largeButton : styles.button)} onPress={() => this.setState({show: true})}>
          <Text>{this.props.title}</Text>
        </TouchableOpacity>
        <Popover 
          debug={true}
          isVisible={this.state.show} 
          onRequestClose={() => {
            if (!this.props.noBackgroundTap) this.setState({show: false});
            console.log("Close Requested");
          }} 
          from={this.touchable}
          verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
          onOpenStart={() => console.log("Open Start")}
          onOpenComplete={() => console.log("Open Complete")}
          onCloseStart={() => console.log("Close Start")}
          onCloseComplete={() => console.log("Close Complete")}
          {...this.props.popoverOptions}>
          <PopoverTestContent dark={this.props.dark} contentText={this.props.contentText} />
          {this.props.dismissButton &&
            <TouchableOpacity onPress={() => this.setState({show: false})} style={{alignItems: 'center', height: 35}}>
              <Text style={{color: 'blue'}}>Dismiss</Text>
            </TouchableOpacity>
          }
        </Popover>
      </React.Fragment>
    )
  }
}

class TouchablePopoverFromElement extends React.Component {
  render() {
    return (
      <Popover 
        debug={true}
        onRequestClose={() => console.log("Close Requested")}
        from={(
          <TouchableOpacity style={this.props.smallButton ? styles.smallButton : (this.props.superLargeButton ? styles.largeButton : styles.button)}>
            <Text>{this.props.title}</Text>
          </TouchableOpacity>
        )}
        verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        onOpenStart={() => console.log("Open Start")}
        onOpenComplete={() => console.log("Open Complete")}
        onCloseStart={() => console.log("Close Start")}
        onCloseComplete={() => console.log("Close Complete")}
        {...this.props.popoverOptions}>
        <PopoverTestContent dark={this.props.dark} contentText={this.props.contentText} />
      </Popover>
    )
  }
}

class TouchablePopoverFromElementFunction extends React.Component {
  render() {
    return (
      <Popover 
        debug={true}
        onRequestClose={() => console.log("Close Requested")}
        from={(sourceRef, openPopover) => (
          <TouchableOpacity ref={sourceRef} style={this.props.smallButton ? styles.smallButton : (this.props.superLargeButton ? styles.largeButton : styles.button)} onPress={openPopover}>
            <Text>{this.props.title}</Text>
          </TouchableOpacity>
        )}
        verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
        onOpenStart={() => console.log("Open Start")}
        onOpenComplete={() => console.log("Open Complete")}
        onCloseStart={() => console.log("Close Start")}
        onCloseComplete={() => console.log("Close Complete")}
        {...this.props.popoverOptions}>
        <PopoverTestContent dark={this.props.dark} contentText={this.props.contentText} />
      </Popover>
    )
  }
}

export default class App extends Component {
  state = {
    showTooltipPopover: false,
    showByMountPopover: false
  }

  constructor() {
    super()
    // Uncomment to test RTL
    //I18nManager.allowRTL(false);
    //I18nManager.forceRTL(false);
    //if (I18nManager.isRTL) {
    //  RNRestart.Restart();
    //}

    this.showByMountButton = React.createRef();
    this.tooltipButton = React.createRef();
  }

  render() {

    const smallButton = Dimensions.get('window').width < 500;

    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={{padding: 20}}>
          <Text>Welcome to the playground!  There's lots to try; feel free to rotate the screen while a Popover is open to see how it adapts!</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TouchablePopoverFromElement key="topLeftCorner" title="Left Against Edge" contentText="The arrow still points to the button even though the view is pushed to the side so that it stays on the screen." smallButton popoverOptions={{placement: PopoverPlacement.BOTTOM}} />
              <TouchablePopover key="smallArrow" title="Smaller Arrow" contentText="Look! The arrow is tiny!" smallButton popoverOptions={{arrowStyle: new Size(5, 5)}} />
              <TouchablePopover key="largeArrow" title="Larger Arrow" contentText="Now it's really big!" smallButton popoverOptions={{arrowStyle: new Size(30, 30)}} />
              <TouchablePopover key="noArrow" title="No Arrow" contentText="And now it's completely gone *poof*" smallButton popoverOptions={{arrowStyle: {backgroundColor: 'transparent'}}} />
              <TouchablePopover key="noBorderRadius" title="No Border Radius" contentText="Maybe rounded isn't your thing?" smallButton popoverOptions={{popoverStyle: {borderRadius: 0}}} />
              <TouchableOpacity ref={this.tooltipButton} style={styles.smallButton} onPress={() => this.setState({showTooltipPopover: true})}>
                <Text>Show Tooltip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} ref={this.showByMountButton} onPress={() => this.setState({showByMountPopover: true})}>
                <Text>Show By Mounting</Text>
              </TouchableOpacity>
              {this.state.showByMountPopover && (
                <Popover
                  isVisible={true}
                  from={this.showByMountButton}
                  onRequestClose={() => this.setState({showByMountPopover: false})}
                  debug={true}
                  verticalOffset={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                  onOpenStart={() => console.log("Open Start")}
                  onOpenComplete={() => console.log("Open Complete")}
                  onCloseStart={() => console.log("Close Start")}
                  onCloseComplete={() => console.log("Close Complete (this will not get printed)")}>
                  <Text style={{ padding: 30 }}>This is shown and hidden by mounting and unmounting the popover, instead of changing isVisible.  Obviously this make for a less than ideal closing experience, but at least it doesn't cause any actual issues.</Text>
                </Popover>
              )}
            </View>
            <View style={styles.container}>
              <TouchablePopover key="left" title="Left Placement" smallButton={smallButton} popoverOptions={{placement: PopoverPlacement.LEFT}} />
              <TouchablePopoverFromElementFunction key="right" title="Right Placement" smallButton={smallButton} popoverOptions={{placement: 'right'}} /> 
              <TouchablePopover key="bottom" title="Bottom Placement" smallButton={smallButton} popoverOptions={{placement: 'bottom'}} />
              <TouchablePopoverFromElementFunction key="top" title="Top Placement" smallButton={smallButton} popoverOptions={{placement: 'top', mode: PopoverMode.JS_MODAL}} />
              <TouchablePopover key="auto" title="Auto Placement" smallButton={smallButton} popoverOptions={{placement: 'auto'}} />
              <TouchablePopover key="centered" title="Centered Floating" smallButton={smallButton} popoverOptions={{placement: 'center'}} />
              <TouchablePopover key="alert" title="Alert on Close" contentText="When this closes, an alert should show to inform you (demo of onCloseComplete callback)"  smallButton={smallButton} popoverOptions={{ onCloseComplete: () => Alert.alert("Popover has closed!")}} />
              <TouchablePopover key="inside" title="Popover Inside Button" superLargeButton={true}  />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchablePopoverFromElement key="topRightCorner" title="Right Against Edge" contentText="The arrow still points to the button even though the view is pushed to the side so that it stays on the screen." smallButton popoverOptions={{placement: PopoverPlacement.BOTTOM}} />
              <TouchablePopover key="noBackground" title="No Background Fade" contentText="You can still tap on the background to dismiss the Popover, you just can't see it!" smallButton popoverOptions={{ backgroundStyle: { backgroundColor: 'transparent' } }} />
              <TouchablePopover key="tapToDismissOff" title="No Tap Background" contentText="Now the background is here, but tapping on it doesn't dismiss the Popover! You'll have to use the button." smallButton noBackgroundTap dismissButton />
              <TouchablePopover key="staticRect" title="Show From Static Rect" contentText="This is anchored to a static rectangle elsewhere on the screen, not to the button that triggered it." smallButton popoverOptions={{from: new Rect(100, 100, 100, 100)}} />
              <TouchablePopover key="backgroundColor" title="Dark Theme" contentText="Check out the different options available through popoverStyle!" smallButton dark popoverOptions={{popoverStyle: {backgroundColor: 'black'}}} />
              <TouchablePopover key="animationConfig" title="No Animation" contentText="You can really customize the animation if you want using animationConfig." smallButton popoverOptions={{animationConfig: {duration: 0}}} />
              <TouchablePopover key="arrowShift" title="Shifted Arrow" contentText="The arrow can be shifted so that it is not pointing at the center of the source view.  This arrow is shifted close to the left side." smallButton popoverOptions={{arrowShift: -0.8}} />
            </View>
          </View>
        </ScrollView>
        <Popover isVisible={this.state.showTooltipPopover} from={this.tooltipButton} mode={PopoverMode.TOOLTIP} placement={PopoverPlacement.TOP} debug={true}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ margin: 10 }}>Some useful info</Text>
            <View style={{ width: 1, height: '100%', backgroundColor: 'black' }} />
            <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ showTooltipPopover: false })}><Text>Close</Text></TouchableOpacity>
          </View>
        </Popover>
      </SafeAreaView>
    );
  }
}

class About extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={{alignItems: 'center', padding: 20}}>
        <Text>This is a test app for react-native-popover-view</Text>
        <Text>(github.com/steffeydev/react-native-popover-view.git)</Text>
      </ScrollView>
    )
  }
}

let shouldShowInPopover = true;

class Settings extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>Popover Navigation</Text>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text>Show Stack Views in Popover</Text>
            <Text style={{fontSize: 10, color: 'gray', marginTop: 5}}>You will need to change the device orientation for this setting to take effect.</Text>
          </View>
          <Switch value={shouldShowInPopover} onValueChange={() => {
            shouldShowInPopover = !shouldShowInPopover;
            this.forceUpdate();
          }} />
        </View>
      </ScrollView>
    )
  }
}

//let Stack = createPopoverStackNavigator({
//  App: {
//    screen: App,
//    navigationOptions: ({navigation}) => ({
//      title: "Popover Test App",
//      headerRight: <TouchableOpacity ref={ref => createPopoverStackNavigator.registerRefForView(ref, 'Settings')} onPress={() => navigation.navigate('Settings')} style={{width: 60, alignItems: 'center'}}><Icon color="#007AFF" name="ios-settings" size={30} /></TouchableOpacity>, 
//      headerLeft: <TouchableOpacity ref={ref => createPopoverStackNavigator.registerRefForView(ref, 'About')} onPress={() => navigation.navigate('About')} style={{width: 60, alignItems: 'center'}}><Icon color="#007AFF" name="ios-information-circle-outline" size={30} /></TouchableOpacity>
//    })
//  },
//  Settings: {
//    screen: Settings,
//    navigationOptions: {title: "Settings"},
//    popoverOptions: {
//      contentContainerStyle: {
//        minWidth: 300
//      }
//    }
//  },
//  About: {
//    screen: About,
//    navigationOptions: {title: "About"},
//    popoverOptions: {
//      contentContainerStyle: {
//        minWidth: 300
//      }
//    }
//  }
//}, {
//  popoverOptions: {
//    verticalOffset: Platform.OS === 'android' ? -StatusBar.currentHeight : 0
//  }
//})
//
//export default class StackWrapper extends Component {
//  state = {
//    width: 0,
//    height: 0
//  }
//
//  render() {
//    return (
//      <View
//        style={{position: 'absolute', left: 0, right: 0, top: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, bottom: 0, backgroundColor: 'green'}}
//        onLayout={evt => this.setState(evt.nativeEvent.layout)}
//      > 
//        <Stack screenProps={{showInPopover: shouldShowInPopover}} />
//      </View>
//    );
//  }
//}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'gray',
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  smallButton: {
    backgroundColor: 'gray',
    width: 90,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 5
  },
  largeButton: {
    backgroundColor: 'gray',
    width: 300,
    height: Dimensions.get('window').height - 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 5
  },
  popoverContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    width: 100,
    height: 25, 
    borderColor: 'gray', 
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15
  }
});
