import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TextInput
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap, MyInput } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';

export default function BarangEdit({ navigation, route }) {
    const item = route.params;
    const [comp, setComp] = useState({});
    console.warn('edit keranjang', item)
    navigation.setOptions({
        headerShown: false,
    });
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    const isFocused = useIsFocused();

    const [jumlah, setJumlah] = useState(route.params.qty);
    const [user, setUser] = useState({});
    const [cart, setCart] = useState(0);

    useEffect(() => {

        axios.post(urlAPI + '/company.php').then(c => {
            console.log(c.data);
            setComp(c.data);
        })
        if (isFocused) {
            // modalizeRef.current.open();
            getData('user').then(res => {
                console.log('data user', res);
                setUser(res);
            });
            getData('cart').then(res => {
                console.log(res);
                setCart(res);
            });
        }

        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
            console.log("Keyboard Shown")
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
            console.log("Keyboard Hide")
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, [isFocused]);

    const modalizeRef = useRef();

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const addToCart = () => {
        const kirim = {
            fid_user: user.id,
            fid_barang: item.id_barang,
            harga_dasar: item.harga_dasar,
            diskon: item.diskon,
            harga: item.harga_barang,
            qty: jumlah,
            uom: uom,
            note: note,
            total: item.harga_barang * jumlah
        };
        console.log('kirim tok server', kirim);
        axios
            .post(urlAPI + '/cart_update.php', kirim)
            .then(x => {
                console.log(x.data);
                if (x.data == 200) {
                    showMessage({
                        type: 'success',
                        message: item.nama_barang + ' berhasil diupdate ke keranjang !'
                    });
                    // navigation.goBack();
                } else {
                    showMessage({
                        type: 'danger',
                        message: item.nama_barang + ' sudah ada di dikeranjang kamu !'
                    })
                }

            });
    };
    const [uom, setUom] = useState(route.params.uom);
    const [note, setNote] = useState(route.params.note);
    const [pilih, setPilih] = useState({
        a: true,
        b: false,
        c: false,
        d: false,
        e: false
    });

    useEffect(() => {

        if (route.params.uom == route.params.satuan) {

            setPilih({
                a: true,
                b: false,
                c: false,
                d: false,
                e: false
            })
        } else if (route.params.uom == route.params.satuan2) {

            setPilih({
                a: false,
                b: true,
                c: false,
                d: false,
                e: false
            })
        } else if (route.params.uom == route.params.satuan3) {

            setPilih({
                a: false,
                b: false,
                c: true,
                d: false,
                e: false
            })
        } else if (route.params.uom == route.params.satuan4) {

            setPilih({
                a: false,
                b: false,
                c: false,
                d: true,
                e: false
            })
        } else if (route.params.uom == route.params.satuan5) {

            setPilih({
                a: false,
                b: false,
                c: false,
                d: false,
                e: true
            })
        }

    }, [])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background1,
            }}>
            <View
                style={{
                    height: 50,
                    // padding: 10,
                    paddingRight: 10,
                    backgroundColor: colors.primary,

                    flexDirection: 'row',
                }}>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon type="ionicon" name="arrow-back-outline" color={colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: windowWidth / 30,
                            color: colors.white,
                        }}>
                        Edit Keranjang
                    </Text>
                </View>

            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background1,
                }}>
                {!keyboardStatus && <View style={{
                    flex: 1,
                }}>
                    <Image
                        style={{
                            height: '100%',
                            width: windowWidth,
                            resizeMode: 'contain'
                        }}
                        source={{
                            uri: item.image,
                        }}
                    /></View>}


                <View
                    style={{
                        backgroundColor: colors.background1,
                        padding: 10,
                    }}>

                    <Text
                        style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 13,
                            color: colors.black,
                        }}>
                        {item.nama_barang}
                    </Text>

                    <Text
                        style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: 10,
                            color: colors.black,

                        }}>
                        {item.keterangan}
                    </Text>




                    <MyInput value={note} onChangeText={x => setNote(x)} iconname="create" placeholder="masukan keterangan jika perlu" multiline label="Catatan" />
                </View>



                <View style={{ flexDirection: 'row', padding: 10 }}>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.textPrimary,
                            }}>
                            Jumlah
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',

                            justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                jumlah == 1
                                    ? showMessage({
                                        type: 'danger',
                                        message: 'Minimal jumlah 1',
                                    })
                                    : setJumlah((parseFloat(jumlah.toString()) - 1).toString());
                            }}
                            style={{
                                backgroundColor: colors.secondary,
                                width: '25%',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 0,
                            }}>
                            <Icon type="ionicon" name="remove" color={colors.white} />
                        </TouchableOpacity>
                        <TextInput value={jumlah} onChangeText={x => setJumlah(x)} keyboardType="number-pad" style={{
                            fontSize: 16, fontFamily: fonts.secondary[600], color: colors.black,
                            textAlign: 'center',
                            width: 80,

                        }} />


                        <TouchableOpacity
                            onPress={() => {
                                if (jumlah >= item.stok) {
                                    showMessage({
                                        type: 'danger',
                                        message: 'Pembelian melebihi batas !',
                                    })
                                } else {
                                    console.log(jumlah);
                                    setJumlah((parseFloat(jumlah.toString()) + 1).toString());
                                }

                            }}
                            style={{
                                backgroundColor: colors.secondary,
                                width: '25%',
                                borderRadius: 10,
                                marginLeft: 0,

                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Icon type="ionicon" name="add" color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text
                    style={{
                        marginHorizontal: 10,
                        fontFamily: fonts.secondary[600],
                        color: colors.textPrimary,
                    }}>
                    Pilih Satuan
                </Text>

                {/* pilihan uom */}
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity onPress={() => {
                        setPilih({
                            a: true,
                            b: false,
                            c: false,
                            d: false,
                            e: false
                        });
                        setUom(item.satuan)
                    }} style={pilih.a ? styles.ok : styles.not}>
                        <Text style={pilih.a ? styles.okText : styles.notText}>{item.satuan}</Text>
                    </TouchableOpacity>

                    {item.satuan2 !== "" &&
                        <TouchableOpacity onPress={() => {
                            setPilih({
                                a: false,
                                b: true,
                                c: false,
                                d: false,
                                e: false
                            });
                            setUom(item.satuan2)
                        }} style={pilih.b ? styles.ok : styles.not}>
                            <Text style={pilih.b ? styles.okText : styles.notText}>{item.satuan2}</Text>
                        </TouchableOpacity>
                    }

                    {item.satuan3 !== "" &&

                        <TouchableOpacity onPress={() => {
                            setPilih({
                                a: false,
                                b: false,
                                c: true,
                                d: false,
                                e: false
                            });
                            setUom(item.satuan3)
                        }} style={pilih.c ? styles.ok : styles.not}>
                            <Text style={pilih.c ? styles.okText : styles.notText}>{item.satuan3}</Text>
                        </TouchableOpacity>
                    }

                    {item.satuan4 !== "" &&
                        <TouchableOpacity onPress={() => {
                            setPilih({
                                a: false,
                                b: false,
                                c: false,
                                d: true,
                                e: false
                            });
                            setUom(item.satuan4)
                        }} style={pilih.d ? styles.ok : styles.not}>
                            <Text style={pilih.d ? styles.okText : styles.notText}>{item.satuan4}</Text>
                        </TouchableOpacity>
                    }

                    {item.satuan5 !== "" &&
                        <TouchableOpacity onPress={() => {
                            setPilih({
                                a: false,
                                b: false,
                                c: false,
                                d: false,
                                e: true
                            });
                            setUom(item.satuan5)
                        }} style={pilih.e ? styles.ok : styles.not}>
                            <Text style={pilih.e ? styles.okText : styles.notText}>{item.satuan5}</Text>
                        </TouchableOpacity>}
                </View>


                <View style={{ margin: 10, flexDirection: 'row' }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                let pesan = 'https://wa.me/' + comp.tlp + '?text=Hai Kak, saya ingin menanyakan tentang produk *' + item.nama_barang + '* Boleh dibantu';
                                console.log(pesan)
                                Linking.openURL(pesan)
                            }}
                            style={{

                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center'


                            }}>
                            <Icon type='ionicon' name="logo-whatsapp" color={colors.success} />

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        <MyButton onPress={addToCart} warna={colors.primary} title="Masukan Ke Keranjang" Icons="cart" />
                    </View>
                </View>
            </View>




        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    not: {
        width: 80,
        borderRadius: 20,
        borderWidth: 2,
        marginHorizontal: 2,
        borderColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    ok: {
        width: 80,
        marginHorizontal: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    notText: {
        fontSize: windowWidth / 28,
        color: colors.primary,
        fontFamily: fonts.secondary[600],
    },
    okText: {
        fontSize: windowWidth / 28,
        color: colors.white,
        fontFamily: fonts.secondary[600],
    }
});
