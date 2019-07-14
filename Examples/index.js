import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Panel from './Panel'
export default class index extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            isVisible: false
        }
    }
    renderContentPanel = (setTopHeightContent, maxHeightScrollView, setContentHeightScroll) => {
        return (
            <View testID='content-wrapper' style={{
                backgroundColor: '#fdfdfd',
                borderRadius: 14,
                position: 'relative',
                elevation: 8, marginHorizontal: 16
            }}>
                <View style={{ height: 100 }} onLayout={(e) => {
                    setTopHeightContent(e.nativeEvent.layout.height)
                }}>
                    <TouchableOpacity onPress={() => this.setState({ isVisible: false })}>
                        <Text>Thoat</Text>
                    </TouchableOpacity>
                </View>
                <View >

                    <ScrollView
                        scrollEnabled={false}
                        style={{ maxHeight: maxHeightScrollView || 300 }}
                        onContentSizeChange={(width, height) => setContentHeightScroll(height)}
                        ref={this.scrollRef}
                    >
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(el => (
                                <Text style={{ backgroundColor: 'gray', color: '#ffff', borderBottomWidth: 1 }} key={el} style={{ fontSize: 22 }}>{`This is ${el}`}</Text>
                            ))
                        }
                    </ScrollView>
                </View>

            </View>
        )
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ isVisible: true })}><Text>Show panel</Text></TouchableOpacity>
                <View testID='PanelWrapper' style={{ height: 400 }} >
                    <Panel scrollRef={this.scrollRef} renderContent={this.renderContentPanel} onClose={() => this.setState({ isVisible: false })} isVisible={this.state.isVisible} />
                </View>
            </View>
        )
    }
}
