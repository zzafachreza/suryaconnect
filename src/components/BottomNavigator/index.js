import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { useState } from 'react';
import { getData, urlAPI } from '../../utils/localStorage';
import { useEffect } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
export default function BottomNavigator({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [cart, setCart] = useState(0);
  const isFocused = useIsFocused();
  useEffect(() => {

    // if (isFocused) {
    //   getData('user').then(users => {
    //     axios.post(urlAPI + '/1_cart.php', {
    //       fid_user: users.id
    //     }).then(res => {
    //       console.log('cart', res.data);

    //       setCart(parseFloat(res.data))
    //     })
    //   })
    // }

  }, [])


  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ backgroundColor: colors.primary, flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {
              key: 0
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName = 'home';
        let Newlabel = '';

        if (label === 'Home') {
          iconName = 'home-outline';
          Newlabel = 'Home';
        } else if (label === 'Produk') {
          iconName = 'cube-outline';
          Newlabel = 'Produk';
        } else if (label === 'Kategori') {
          iconName = 'grid-outline';
          Newlabel = 'Kategori';
        } else if (label === 'Cart') {
          iconName = 'cart-outline';
          Newlabel = 'Keranjang';
        } else if (label === 'History') {
          iconName = 'receipt-outline';
          Newlabel = 'History';
        } else if (label === 'Favorit') {
          iconName = 'heart-outline';
          Newlabel = 'Favorit';
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={
              label === 'Kategori'
                ? () =>
                  navigation.navigate('Barang', {
                    key: 0
                  })
                : onPress
            }
            onLongPress={onLongPress}
            style={{ flex: 1 }}>
            <View
              style={{
                color: isFocused ? colors.primary : '#919095',
                paddingTop: 5,
                paddingBottom: 0,
                fontSize: 12,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>

              <View
                style={{
                  width: 80,
                  bottom: 0,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                {/* {label == 'Cart' && <Text style={{
                  position: 'absolute', top: 0, right: 20, bottom: 0, backgroundColor: colors.white, width: 15,
                  textAlign: 'center',
                  fontSize: 11,
                  height: 15, borderRadius: 10, color: colors.primary
                }} >{cart}</Text>} */}
                <Icon
                  name={isFocused ? iconName.replace('-outline', '') : iconName}
                  type="ionicon"
                  size={windowWidth / 20}
                  color={isFocused ? colors.white : colors.white}
                />

                <Text
                  style={{
                    fontSize: windowWidth / 45,
                    color: isFocused ? colors.white : colors.white,
                  }}>
                  {Newlabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: iconName => ({
    // paddingTop: 5,
    // paddingBottom: 5,
    // fontSize: 12,
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
  }),
  box: iconName => ({}),
});
