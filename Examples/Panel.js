import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Keyboard, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen')
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const runAnimation = (stateAnimation, toValue, duration, callBack) => {
    try {
        Animated.timing(stateAnimation, {
            toValue: toValue,
            duration: duration
        }).start(() => {
            callBack && callBack()
        })
    } catch (error) {
        console.log({ error })
    }
}

export default class PanelSliding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            maxHeightScrollView: false
        }
        this.scrollRef = React.createRef()
    }
    componentDidUpdate(preProps) {
        if (preProps.isVisible !== this.props.isVisible) {
            if (this.props.isVisible) {
                //Animation up
                runAnimation(this.top, 0, 300)
            } else {
                runAnimation(this.top, height,300,()=>{
                    this.animation.flattenOffset();
                    this.animation.y.setValue(0)
                })
                
            }
        }
    }

    /**
     * Neu callOffsetMove return < 0 thi dang move up, nguoc lai
     */
    calOffsetMove = (dy) => {
        return dy - this.preDy
    }
    calOffsetScroll = (dy) => {
        return preDy - this.dy
    }
    handleMove = ({ dy }) => {
        const totalScroll = this.getTotalScrollView();
        const currentTranslateY = this.getCurrentTranslateY();

        let newOffset = 0;
        if (dy > this.preDy) {
            //Dang di xuong
            newOffset = - (Math.abs(dy - this.preDy))
        } else {
            newOffset = + (Math.abs(dy - this.preDy))
        }
        const offsetMove = this.calOffsetMove(dy)
        console.log('offsetMove', offsetMove)
        console.log({
            preDy: this.preDy,
            dy: dy,
            currentTranslateY: currentTranslateY,
            move: newOffset,
            offset: this.scrollOffset,
            totalScroll
        })
        // console.log('moveOffset',newOffset)
        if (offsetMove < 0) {
            //move up
            if (currentTranslateY === 0) {
                if (totalScroll <= this.contentHeight) {

                    this.onScrollTo(this.scrollOffset + newOffset)
                }
            } else {
                this.animation.extractOffset()
                this.animation.setValue({
                    x: 0, y: offsetMove
                })
            }
        } else {
            //Move down
            if (currentTranslateY === 0) {
                if (this.scrollOffset > 0) {

                    this.onScrollTo(this.scrollOffset + newOffset)
                } else {
                    this.animation.extractOffset()
                    this.animation.setValue({
                        x: 0, y: offsetMove
                    })

                }
            } else {
                this.animation.extractOffset()
                this.animation.setValue({
                    x: 0, y: offsetMove
                })
            }
        }
        this.preDy = dy;
    }
    getTotalScrollView = () => this.scrollOffset + this.scrollViewHeight;
    getCurrentTranslateY = () => {

        return this.animation.y._value + this.animation.y._offset < 0 ? 0 : this.animation.y._value + this.animation.y._offset
    }
    componentWillMount() {
        this.top = new Animated.Value(height)
        this.animation = new Animated.ValueXY({ x: 0, y: 0 })
        this.translateYAnimation = new Animated.Value(0)
        this.currentTranslateY = this.animation.y._value + this.animation.y._offset
        this.lastTransalateY = 0
        this.scrollOffset = 0
        this.scrollViewHeight = 300
        this.preDy = 0
        this.contentHeight = 0
        this.isScroll = false;
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, { dy, moveY, y0 }) => {
                return Math.abs(dy) > 0.5
            },
            onPanResponderGrant: (evt, { dy, moveY, y0 }) => {
                this.animation.extractOffset()
                this.preDy = dy
            },
            onPanResponderMove: (evt, { dy, moveY, y0 }) => {
                this.handleMove({ dy });
            },
            onPanResponderRelease: (evt, { dy, moveY, y0 }) => {
                const currentTranslateY = this.getCurrentTranslateY()
                this.preDy = 0
                if (dy > this.preDy) {
                    //Down
                    newOffset = - (Math.abs(dy - this.preDy))
                } else {
                    newOffset = + (Math.abs(dy - this.preDy))
                }
                if (this.lastTransalateY === 0) {
                    if (currentTranslateY > 100) {
                        this.animation.flattenOffset();
                        runAnimation(this.animation.y, height / 2, 200, () => {
                            this.lastTransalateY = height / 2
                        })
                    } else {
                        this.animation.flattenOffset();
                        runAnimation(this.animation.y, 0, 200, () => {
                            this.lastTransalateY = 0
                        })
                    }
                } else {
                    if (newOffset > 0) {
                        //move up
                        this.animation.flattenOffset();
                        runAnimation(this.animation.y, 0, 200, () => {
                            this.lastTransalateY = 0
                        })
                    } else {
                        //Move down
                        this.animation.flattenOffset();
                        runAnimation(this.animation.y, height / 2, 200, () => {
                            this.lastTransalateY = height / 2
                        })
                    }
                }
            }
        })
    }

    onScroll = ({ nativeEvent: { contentOffset: { y }, layoutMeasurement: { height } } }) => {
        this.scrollViewHeight = height;
        this.scrollOffset = y

    }
    getTotalHeightPanel = (event) => {
        const heightPanel = event.nativeEvent.layout.height
        const maxHeightScrollView = heightPanel - this.heightTopContent

        this.scrollViewHeight = maxHeightScrollView || 300
        if (maxHeightScrollView > 0) {
            this.setState({
                maxHeightScrollView: maxHeightScrollView
            })
        }
    }
    setTopHeightContent = (heightTop) => {
        this.heightTopContent = heightTop
    }
    onScrollTo = (newOffset) => {
        this.isScroll = true
        if (newOffset < 0) {
            newOffset = 0;
        }
        if (this.scrollOffset + this.scrollViewHeight <= this.contentHeight) {
            this.scrollOffset = newOffset
            this.props.scrollRef.current.scrollTo({ x: 0, y: newOffset, animated: false })
        } else {
            this.scrollOffset = this.contentHeight - this.scrollViewHeight
            console.log('khong scroll')
        }

    }
    setContentHeight = (contentHeight) => {
        this.contentHeight = contentHeight
    }
    render() {

        this.animation.y.interpolate({
            inputRange: [-height, 0, height],
            outputRange: [0, 0, height],
        });
        const animationHeight = {
            transform: [
                {
                    translateY: this.animation.y.interpolate({
                        inputRange: [-height, 0, height],
                        outputRange: [0, 0, height],
                    })
                }
            ]
        }
        const { renderContent, isVisible } = this.props
        return (
                <Animated.View onLayout={this.getTotalHeightPanel} {...this._panResponder.panHandlers} style={[styles.container,animationHeight,{top:this.top}]} >
                    {
                        this.props.renderContent(this.setTopHeightContent, this.state.maxHeightScrollView, this.setContentHeight)
                    }
                </Animated.View>
        );
    }

}
//List props
/**
 * scroll_ref, isVisible
 */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
    },
    icon: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    },
});
