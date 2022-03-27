import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
  Platform,
  StatusBar,
  Alert,
  I18nManager,
  Animated,
} from "react-native";
import Popover, {
  PopoverPlacement,
  PopoverMode,
} from "react-native-popover-view";

function PopoverTestContent() {
  const [contentWidth, setContentWidth] = useState(null);
  const [contentWidthTemp, setContentWidthTemp] = useState("250");
  const [contentHeight, setContentHeight] = useState(400);
  const [contentHeightTemp, setContentHeightTemp] = useState("400");
  return (
    <ScrollView
      style={{ width: contentWidth }}
      contentContainerStyle={[
        StyleSheet.flatten(styles.popoverContent),
        { height: contentHeight },
      ]}
    >
      <Text>The popover can adapt to content size, screen rotation, and keyboad visibility changes. Try it out!</Text>
      <View
        style={{
          borderColor: "gray",
          borderWidth: 2,
          padding: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ marginBottom: 10, textAlign: "center" }}>
          Adjust Content Size
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ justifyContent: "center" }}>Width: </Text>
          <TextInput
            style={styles.textInput}
            onSubmitEditing={() =>
              setContentWidth(Math.max(200, parseInt(contentWidthTemp)))
            }
            keyboardType='number-pad'
            onChangeText={(width) => setContentWidthTemp(width)}
            value={contentWidthTemp}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Height: </Text>
          <TextInput
            style={styles.textInput}
            onSubmitEditing={() =>
              setContentHeight(Math.max(200, parseInt(contentHeightTemp)))
            }
            keyboardType='number-pad'
            onChangeText={(height) => setContentHeightTemp(height)}
            value={contentHeightTemp}
          />
        </View>
      </View>
      <View style={{ height: 0, width: 10, backgroundColor: "black" }} />
    </ScrollView>
  );
}

function DebugPopover(props) {
  const { content, noPadding, ...otherProps } = props;
  return (
    <Popover
      displayAreaInsets={{ left: 10, right: 10, top: 50, bottom: 50 }}
      debug={true}
      verticalOffset={Platform.OS === "android" ? -StatusBar.currentHeight : 0}
      onOpenStart={() => console.log("Open Start")}
      onOpenComplete={() => console.log("Open Complete")}
      onCloseStart={() => console.log("Close Start")}
      onCloseComplete={() => console.log("Close Complete")}
      {...otherProps}
    >
      <View style={!noPadding ? { padding: 20 } : {}}>{content}</View>
    </Popover>
  );
}

function TouchablePopover(props) {
  const { title, ...otherProps } = props;
  return (
    <DebugPopover
      from={
        <TouchableOpacity style={styles.button}>
          <Text>{title}</Text>
        </TouchableOpacity>
      }
      {...otherProps}
    />
  );
}

function PopoverFromRef(props) {
  const { title, ...otherProps } = props;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        ref={ref}
        onPress={() => setVisible(true)}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
      <TouchablePopover
        {...otherProps}
        from={ref}
        isVisible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

function PopoverFromRect(props) {
  const { title, ...otherProps } = props;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        ref={ref}
        onPress={() => setVisible(true)}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
      <TouchablePopover
        {...otherProps}
        from={{ x: 100, y: 100, width: 50, height: 50 }}
        isVisible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

function PopoverFromPoint(props) {
  const { title, ...otherProps } = props;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        ref={ref}
        onPress={() => setVisible(true)}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
      <TouchablePopover
        {...otherProps}
        from={{ x: 100, y: 100 }}
        isVisible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}

function PopoverNoTapBackground(props) {
  const { title, content, ...otherProps } = props;
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchablePopover
        {...otherProps}
        from={(ref) => (
          <TouchableOpacity
            style={styles.button}
            ref={ref}
            onPress={() => setVisible(true)}
          >
            <Text>{title}</Text>
          </TouchableOpacity>
        )}
        content={
          <>
            {content}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{ alignItems: "center", height: 35 }}
            >
              <Text style={{ color: "blue" }}>Dismiss</Text>
            </TouchableOpacity>
          </>
        }
        isVisible={visible}
      />
    </>
  );
}

function PopoverToggleFrom() {
  const [includeFrom, setIncludeFrom] = useState(true);
  return (
    <DebugPopover
      from={
        includeFrom ? (
          <TouchableOpacity style={styles.button}>
            <Text>Toggle from</Text>
          </TouchableOpacity>
        ) : null
      }
      content={(
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setIncludeFrom(!includeFrom)}
        >
          <Text>Toggle</Text>
        </TouchableOpacity>
      )}
    />
  );
}

function PopoverShowByMounting() {
  const [mount, setMount] = useState(false);
  const ref = useRef();
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        ref={ref}
        onPress={() => setMount(true)}
      >
        <Text>Show By Mounting</Text>
      </TouchableOpacity>
      {mount && (
        <DebugPopover
          isVisible={true}
          from={ref}
          onRequestClose={() => setMount(false)}
          content={
            <Text>
              This is shown and hidden by mounting and unmounting the popover,
              instead of changing isVisible. Obviously this make for a less than
              ideal closing experience, but at least it doesn't cause any actual
              issues.
            </Text>
          }
        />
      )}
    </>
  );
}

function Section({ title, popovers }) {
  return (
    <>
      <View
        style={{
          backgroundColor: "gray",
          padding: 5,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>{title.toUpperCase()}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {popovers.map((popover, i) => (
          <View key={i} style={{ padding: 7 }}>
            {popover}
          </View>
        ))}
      </View>
    </>
  );
}

export default function App() {
  // Uncomment to test RTL
  //I18nManager.allowRTL(false);
  //I18nManager.forceRTL(false);
  //if (I18nManager.isRTL) {
  //  RNRestart.Restart();
  //}
  const tooltipRef = useRef();
  const [tooltipPopoverVisible, setTooltipPopoverVisible] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontSize: 20, fontWeight: 'bold' }}>
          react-native-popover-view
        </Text>
        <Section
          title="Dynamic Content Handling"
          popovers={[
            <TouchablePopover
              key="adjustable"
              title="Adjustable Content Size"
              content={<PopoverTestContent />}
            />
          ]}
        />
        <Section
          title="Placement Options"
          popovers={[
            <TouchablePopover
              key="right"
              title="Right"
              placement={PopoverPlacement.RIGHT}
              content={<Text>This popover shows to the right</Text>}
            />,
            <TouchablePopover
              key="top"
              title="Top"
              placement={PopoverPlacement.TOP}
              content={<Text>This popover shows on top</Text>}
            />,
            <TouchablePopover
              key="bottom"
              title="Bottom"
              placement={PopoverPlacement.BOTTOM}
              content={<Text>This popover shows underneath</Text>}
            />,
            <TouchablePopover
              key="left"
              title="Left"
              placement={PopoverPlacement.LEFT}
              content={<Text>This popover shows to the left</Text>}
            />,
            <TouchablePopover
              key="floating"
              title="Floating"
              placement={PopoverPlacement.FLOATING}
              content={<Text>This popover is not anchored</Text>}
            />,
            <TouchablePopover
              key="auto"
              title="Auto"
              placement={PopoverPlacement.AUTO}
              content={<Text>This popover is placed automatically</Text>}
            />,
          ]}
        />

        <Section
          title="Style Options"
          popovers={[
            <TouchablePopover
              key="backgroundColor"
              title="Dark Theme"
              popoverStyle={{ backgroundColor: "black" }}
              content={<Text style={{ color: "white" }}>Come to the dark side... (custom backgroundColor)</Text>}
            />,
            <TouchablePopover
              key="transparentBackground"
              title="Transparency"
              popoverStyle={{ backgroundColor: "rgba(255,255,255,0.7)" }}
              content={<Text>You can sorta see through it! (custom backgroundColor)</Text>}
            />,
            <TouchablePopover
              key="shadow"
              title="Drop Shadow"
              content={<Text>Retro shadow (iOS only)</Text>}
              popoverStyle={{
                shadowColor: "cyan",
                shadowOffset: {
                  width: 3,
                  height: 5,
                },
                shadowOpacity: 1,
                shadowRadius: 3,
                elevation: 4,
              }}
            />,
            <TouchablePopover
              key="noBorderRadius"
              title="No Border Radius"
              content={<Text>Maybe rounded isn't your thing? (custom borderRadius)</Text>}
              popoverStyle={{ borderRadius: 0 }}
            />,
            <TouchablePopover
              key="noBackground"
              title="No Background Fade"
              content={
                <Text>
                  You can still tap on the background to dismiss the Popover,
                  you just can't see it!
                </Text>
              }
              backgroundStyle={{ backgroundColor: "transparent" }}
              popoverStyle={{
                shadowColor: "gray",
                shadowOpacity: 1,
              }}
            />,
          ]}
        />

        <Section
          title="Arrow options"
          popovers={[
            <TouchablePopover
              key="smallArrow"
              title="Smaller Arrow"
              content={<Text>Look! The arrow is tiny!</Text>}
              arrowSize={{ width: 5, height: 5 }}
            />,
            <TouchablePopover
              key="largeArrow"
              title="Larger Arrow"
              content={<Text>Now it's really big!</Text>}
              arrowSize={{ width: 30, height: 30 }}
            />,
            <TouchablePopover
              key="noArrow"
              title="No Arrow"
              content={<Text>And now it's completely gone *poof*</Text>}
              arrowSize={{ width: 0, height: 0 }}
              offset={10}
            />,
            <TouchablePopover
              key="arrowShift"
              title="Shifted Arrow"
              content={
                <Text>
                  The arrow can be shifted so that it is not pointing at the
                  center of the source view. This arrow is shifted close to the
                  left side.
                </Text>
              }
              arrowShift={-0.8}
            />,
          ]}
        />

        <Section
          title="Floating Popover Shift"
          popovers={[
            <TouchablePopover
              key="popoverShiftLeft"
              title="Left Center"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the left side of the screen
                </Text>
              }
              popoverShift={{ x: -1 }}
            />,
            <TouchablePopover
              key="popoverShiftRight"
              title="Right Center"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the right side of the screen
                </Text>
              }
              popoverShift={{ x: 1 }}
            />,
            <TouchablePopover
              key="popoverShiftTop"
              title="Top Center"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the right side of the screen
                </Text>
              }
              popoverShift={{ y: -1 }}
            />,
            <TouchablePopover
              key="popoverShiftBottom"
              title="Bottom Center"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the right side of the screen
                </Text>
              }
              popoverShift={{ y: 1 }}
            />,
            <TouchablePopover
              key="popoverShiftTopLeft"
              title="Top Left"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the right side of the screen
                </Text>
              }
              popoverShift={{ x: -1, y: -1 }}
            />,
            <TouchablePopover
              key="popoverShiftTopLeft"
              title="Bottom Right"
              placement={PopoverPlacement.FLOATING}
              content={
                <Text style={{ maxWidth: 200 }}>
                  Popover is floating on the right side of the screen
                </Text>
              }
              popoverShift={{ x: 1, y: 1 }}
            />,
          ]}
        />

        <Section
          title="From Options"
          popovers={[
            <DebugPopover
              key="fromElement"
              content={<Text>'from' prop is a function</Text>}
              from={
                <TouchableOpacity style={styles.button}>
                  <Text>Element</Text>
                </TouchableOpacity>
              }
            />,
            <DebugPopover
              key="fromFunction"
              content={<Text>'from' prop is an element</Text>}
              from={(sourceRef, openPopover) => (
                <TouchableOpacity
                  ref={sourceRef}
                  style={styles.button}
                  onPress={openPopover}
                >
                  <Text>Function</Text>
                </TouchableOpacity>
              )}
            />,
            <PopoverFromRef
              key="fromRef"
              title="Ref"
              content={<Text>'from' prop is a ref</Text>}
            />,
            <PopoverFromRect
              key="fromRect"
              title="Rect"
              content={<Text>'from' prop is a rectangle</Text>}
            />,
            <PopoverFromPoint
              key="fromPoint"
              title="Point"
              content={<Text>'from' prop is a point</Text>}
            />,
          ]}
        />

        <Section
          title="Advanced"
          popovers={[
            <TouchablePopover
              key="offset"
              title="Popover offset"
              content={
                <Text>Popover is offset from the source view by 50px</Text>
              }
              offset={50}
            />,
            <TouchablePopover
              key="alert"
              title="Alert on Close"
              content={
                <Text>
                  When this closes, an alert should show to inform you (demo of
                  onCloseComplete callback)
                </Text>
              }
              onCloseComplete={() => Alert.alert("Popover has closed!")}
            />,
            <PopoverNoTapBackground
              key="tapToDismissOff"
              title="No Tap Background"
              content={
                <Text>
                  Now the background is here, but tapping on it doesn't dismiss
                  the Popover! You'll have to use the button.
                </Text>
              }
            />,
            <TouchablePopover
              key="animationConfig"
              title="No Animation"
              content={
                <Text>
                  You can really customize the animation if you want using
                  animationConfig.
                </Text>
              }
              animationConfig={{ duration: 0 }}
            />,
            <TouchablePopover
              key="customDisplayArea"
              title="Display on Top"
              content={
                <Text>The display area is only the top half of the screen</Text>
              }
              displayArea={{
                x: 0,
                y: 0,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height / 2,
              }}
            />,
            <TouchablePopover
              key="customDisplayAreaInsets"
              title="Display on Bottom"
              content={
                <Text>
                  The display area is only the bottom half of the screen, but
                  this time because of insets
                </Text>
              }
              displayAreaInsets={{ top: Dimensions.get("window").height / 2 }}
            />,
            <PopoverToggleFrom />,
            <PopoverShowByMounting />,
            <TouchableOpacity
              ref={tooltipRef}
              style={styles.button}
              onPress={() => setTooltipPopoverVisible(!tooltipPopoverVisible)}
            >
              <Text>{tooltipPopoverVisible ? 'Hide Tooltip' : 'Show Tooltip'}</Text>
            </TouchableOpacity>
          ]}
        />

        <DebugPopover
          isVisible={tooltipPopoverVisible}
          from={tooltipRef}
          mode={PopoverMode.TOOLTIP}
          verticalOffset={0}
          popoverStyle={{
            backgroundColor: 'rgb(230,230,230)',
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: { x: 0, y: 15 }
          }}
          noPadding
          content={
            <View style={{ flexDirection: "row" }}>
              <Text style={{ margin: 10 }}>This is a tooltip</Text>
              <View
                style={{ width: 1, height: "100%", backgroundColor: "black" }}
              />
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => setTooltipPopoverVisible(false)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View style={{ marginLeft: -100, width: 200, marginTop: 30 }}>
          <TouchablePopover
            key="partlyOffScreen"
            title="Button partly off screen"
            content={<Text>Not everything aligns perfectly</Text>}
            placement="top"
          />
        </View>

        <DebugPopover
          key="inside"
          from={
            <TouchableOpacity style={styles.largeButton}>
              <Text>Button too big to always show popover anchored</Text>
            </TouchableOpacity>
          }
          content={
            <Text>
              This will want to show above the popover, but will float if
              there's no space
            </Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  largeButton: {
    backgroundColor: "lightgray",
    width: 300,
    height: Dimensions.get("window").height - 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    padding: 5,
  },
  popoverContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    width: 100,
    height: 25,
    borderColor: "gray",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
});
