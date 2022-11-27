const mysql = require('mysql'),
	{ app, BrowserWindow, ipcMain, shell } = require('electron'),
	fs = require("fs"),
	path = require('path');


function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		slashes: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: false,
			enableRemoteModule: true,
			nodeIntegration: true
		},

	})

	win.loadFile('index.html')


	ipcMain.on('close', (event, arg) => {

		if (process.platform !== 'darwin') {
			app.quit()
		}

	});

	var co = false;

	ipcMain.on("verifco", (event, data) => {
		console.log("Verifco")

		if (co == false) {
			win.loadFile('connexion.html')
		} else {
			win.loadFile('index.html')
		}

	});



	const connection = mysql.createConnection({ //connection bdd
		host: 'mysql-nootnoot.alwaysdata.net',
		user: 'nootnoot',
		password: 'nerf@akshan',
		database: 'nootnoot_noot'
	});

	var username = "Anonymous";

	ipcMain.on("submitForm", (event, data) => {
		if (data.username == "" && data.password == "") {
			return event.returnValue = "Veuillez remplir tous les champs";
		} else if (data.username == "") {
			data.username = username;
			return event.returnValueVotre = "Nous vous avons mis un nom d'utilisateur par défaut";
		} else if (data.password.length < 3) {
			return event.returnValue = "Votre mot de passe minimum 3 caractères";
		} else {
			console.log(data)

			connection.query(`INSERT INTO \`accounts\` (\`username\`, \`password\`) VALUES ("${data.username}", "${data.password}");`, function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) {
					return console.log(error);
				}
				// If the account exists, redirect to the login page
				if (results.protocol41 == true) {
					username = data.username;
					// ça a fonctionner.
					co = true;

					event.returnValue = true;

				} else {
					// ça n'a pas fonctionner
					co = false;

					event.returnValue = "Une erreur est survenue, veuillez réessayer plus tard !"

				}

			});
		}
	});


	ipcMain.on("login", (event, data) => {
		if (data.username == "" || data.password == "") {
			return event.returnValue = "Veuillez remplir tous les champs";
		} else {
			console.log(data)

			connection.query(`SELECT username FROM accounts WHERE username = ? AND password = ?`, [data.username, data.password], function (error, results, fields) {
				// If there is an issue with the query, output the error
				console.log(results)
				if (error) {
					return console.log(error);
				}
				// If the account exists, redirect to the login page
				if (results.length > 0) {
					username = data.username;
					// ça a fonctionner.
					co = true;

					event.returnValue = true;

				} else {
					// ça n'a pas fonctionner
					co = false;

					event.returnValue = "Une erreur est survenue, veuillez réessayer plus tard !"

				}

			});
		}
	});

	const basepath = app.getAppPath();

	ipcMain.on("basepath", (event, data) => {
		console.log(basepath)
		event.returnValue = `${basepath}`;

	})

	ipcMain.on("enregistre", (event, data) => {
		//path.resolve(__dirname, `${process.env.APPDATA}/ShadowMario/${game}/ninjamuffin99/`, 'funkin.sol');
		const current = require(path.resolve(__dirname, `${basepath}/data/`, 'listgame.json'));
		const namedata = data.split(/(\\|\/)/g).pop();
		var verif = 0
		try {
			//verification pas doublon
			let i = 0;
			while (i < (current.allgame).length) {
				console.log(current.allgame[i].name)
				console.log(namedata)
				if (current.allgame[i].name == namedata) {
					verif = 1;
					event.returnValue = "Vous avez déjà mis ce .exe"
				}
				i++;
			}

		} catch (err) {
			event.returnValue = "Il n'a pas reussi"
			return console.log(err)
		} finally {
			if (verif == 0) {

				event.returnValue = true;
				let student = {
					id: (current.allgame).length,
					name: namedata,
					path: data
				};
				console.log(current.allgame);
				(current.allgame).push(student);
				fs.writeFileSync(`${basepath}/data/listgame.json`, JSON.stringify(current, null, 4));

			} else {
				event.returnValue = "Vous avez déjà mis ce .exe"
			}


		}

	});

	ipcMain.on("launch", (event, data) => {
		console.log(data)
		shell.openPath(data)

	})

	ipcMain.on("deleteall", (event, data) => {
		try {
			fs.writeFile(`${basepath}/data/listgame.json`, JSON.stringify({ allgame: [] }, null, 4), function (err) {
				if (err) throw err;
				console.log('Saved!');
			});
		} catch (err) {
			console.log(err)
		}

	})
	ipcMain.on("writescoreweek", (event, data) => {
		try {

			console.log(data)
			week(data);
		} catch (err) {
			event.returnValue = "Il n'a pas reussi";
			console.log(err)
		} finally {
			event.returnValue = true;
		}

	});




};




app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})


function week(dataname) {
	(function ($global) {
		"use strict";
		var $hxClasses = {}, $hxEnums = $hxEnums || {};
		class HxOverrides {
			static strDate(s) {
				switch (s.length) {
					case 8:
						let k = s.split(":");
						let d = new Date();
						d["setTime"](0);
						d["setUTCHours"](k[0]);
						d["setUTCMinutes"](k[1]);
						d["setUTCSeconds"](k[2]);
						return d;
					case 10:
						let k1 = s.split("-");
						return new Date(k1[0], k1[1] - 1, k1[2], 0, 0, 0);
					case 19:
						let k2 = s.split(" ");
						let y = k2[0].split("-");
						let t = k2[1].split(":");
						return new Date(y[0], y[1] - 1, y[2], t[0], t[1], t[2]);
					default:
						throw haxe_Exception.thrown("Invalid date format : " + s);
				}
			}
			static substr(s, pos, len) {
				if (len == null) {
					len = s.length;
				} else if (len < 0) {
					if (pos == 0) {
						len = s.length + len;
					} else {
						return "";
					}
				}
				return s.substr(pos, len);
			}
			static now() {
				return Date.now();
			}
		}
		$hxClasses["HxOverrides"] = HxOverrides;
		HxOverrides.__name__ = true;
		Math.__name__ = true;
		class Reflect {
			static field(o, field) {
				try {
					return o[field];
				} catch (_g) {
					return null;
				}
			}
			static isFunction(f) {
				if (typeof (f) == "function") {
					return !(f.__name__ || f.__ename__);
				} else {
					return false;
				}
			}
		}
		$hxClasses["Reflect"] = Reflect;
		Reflect.__name__ = true;
		class Test {
			static main() {
				let s = fs.readFileSync((path.resolve(__dirname, `${process.env.APPDATA}/ShadowMario/${dataname}/ninjamuffin99/`, 'funkin.sol')), 'utf8');
				//let s = "oy11:timeBarTypey11:Time%20Lefty11:comboOffsetazzzzhy8:arrowHSVaazzzhazzzhazzzhazzzhhy12:middleScrollfy9:scoreZoomty10:noteOffsetzy12:ghostTappingty14:healthBarAlphai1y12:noteSplashesty16:gameplaySettingsby12:opponentplayfy9:instakillfy11:scrollspeedi1y9:songspeedi1y7:botplayfy8:practicefy10:healthgaini1y10:scrolltypey14:multiplicativey10:healthlossi1hy10:lowQualityfy7:showFPSty10:goodWindowi90y9:frameratei144y7:noResetfy7:shadersfy10:sickWindowi45y10:downScrollfy12:ratingOffsetzy8:camZoomsty10:songRatingby8:foreplayd0.887971698113208y11:malfunctiond0.8996138996139y11:donnie-softd0.834459459459459y14:encounter-nullzy9:encounterd0.955947136563877y14:encounter-hardzy3:sexzy10:drift-easyd0.87639405204461y16:malfunction-hardzy16:donnie-soft-hardzy5:driftzy6:insaned0.854901960784314y8:aye-papid0.91304347826087y17:kagayaku-kassettod0.875y4:uhohd0.822265625y9:uhoh-hardzy22:kagayaku-kassetto-hardzy8:collapsezy11:insane-hardzy16:malfunction-easyzy10:drift-hardzhy8:flashingty10:safeFramesi10y13:henchmenDeathzy10:weekScoresby10:week9-easyzy6:week10zy10:week8-easyzy10:week9-hardzy5:week7zy11:week10-easyzy10:week8-hardzy10:week7-easyi278330y5:week8i157270y11:week10-hardzy10:week7-hardzy5:week9zhy7:hideHudfy9:badWindowi135y14:hitsoundVolumezy10:songScoresbR32i61930R33i77360R34i40520R35zR36i73500R37zR38zR39i77510R40zR41zR42zR43i71110R44i34550R45i43510R46i67800R47zR48zR49zR50zR51zR52zhy13:weekCompletedbR65tR61thy18:globalAntialiasingty15:achievementsMapby17:friday_night_playthy10:fullscreenfy13:imagesPersistfy14:controllerModefg";
				let unserializer = new haxe_Unserializer(s);
				let res = unserializer.unserialize();
				fs.writeFileSync(`${basepath}/data/weekscore.json`, JSON.stringify(res.weekScores));
				fs.writeFileSync(`${basepath}/data/songscore.json`, JSON.stringify(res.songScores));
				// il y a res.songScores qui contient les scores
				// il y a res.weekScores qui contient les scores par "semaine"
				// res.songScores.forEach((item, index) => {
				//   console.log(item);
				// });

				//console.log("Test.hx:8:",JSON.stringify(res));
				//console.log("Test.hx:9:","---");
				//console.log("Test.hx:10:",JSON.stringify(res.weekScores));
				//console.log("Test.hx:11:","---");
				//let scores = res.weekScores;
				//console.log("Test.hx:13:",scores.h["week7-easy"]);
			}
		}
		$hxClasses["Test"] = Test;
		Test.__name__ = true;
		class Type {
			static createEnum(e, constr, params) {
				let f = Reflect.field(e, constr);
				if (f == null) {
					throw haxe_Exception.thrown("No such constructor " + constr);
				}
				if (Reflect.isFunction(f)) {
					if (params == null) {
						throw haxe_Exception.thrown("Constructor " + constr + " need parameters");
					}
					return f.apply(e, params);
				}
				if (params != null && params.length != 0) {
					throw haxe_Exception.thrown("Constructor " + constr + " does not need parameters");
				}
				return f;
			}
		}
		$hxClasses["Type"] = Type;
		Type.__name__ = true;
		class haxe_IMap {
		}
		$hxClasses["haxe.IMap"] = haxe_IMap;
		haxe_IMap.__name__ = true;
		class haxe_Exception extends Error {
			constructor(message, previous, native) {
				super(message);
				this.message = message;
				this.__previousException = previous;
				this.__nativeException = native != null ? native : this;
			}
			get_native() {
				return this.__nativeException;
			}
			static thrown(value) {
				if (((value) instanceof haxe_Exception)) {
					return value.get_native();
				} else if (((value) instanceof Error)) {
					return value;
				} else {
					let e = new haxe_ValueException(value);
					return e;
				}
			}
		}
		$hxClasses["haxe.Exception"] = haxe_Exception;
		haxe_Exception.__name__ = true;
		class haxe__$Unserializer_DefaultResolver {
			constructor() {
			}
			resolveClass(name) {
				return $hxClasses[name];
			}
			resolveEnum(name) {
				return $hxEnums[name];
			}
		}
		$hxClasses["haxe._Unserializer.DefaultResolver"] = haxe__$Unserializer_DefaultResolver;
		haxe__$Unserializer_DefaultResolver.__name__ = true;
		class haxe_Unserializer {
			constructor(buf) {
				this.buf = buf;
				this.length = this.buf.length;
				this.pos = 0;
				this.scache = [];
				this.cache = [];
				let r = haxe_Unserializer.DEFAULT_RESOLVER;
				if (r == null) {
					r = new haxe__$Unserializer_DefaultResolver();
					haxe_Unserializer.DEFAULT_RESOLVER = r;
				}
				this.resolver = r;
			}
			readDigits() {
				let k = 0;
				let s = false;
				let fpos = this.pos;
				while (true) {
					let c = this.buf.charCodeAt(this.pos);
					if (c != c) {
						break;
					}
					if (c == 45) {
						if (this.pos != fpos) {
							break;
						}
						s = true;
						this.pos++;
						continue;
					}
					if (c < 48 || c > 57) {
						break;
					}
					k = k * 10 + (c - 48);
					this.pos++;
				}
				if (s) {
					k *= -1;
				}
				return k;
			}
			readFloat() {
				let p1 = this.pos;
				while (true) {
					let c = this.buf.charCodeAt(this.pos);
					if (c != c) {
						break;
					}
					if (c >= 43 && c < 58 || c == 101 || c == 69) {
						this.pos++;
					} else {
						break;
					}
				}
				return parseFloat(HxOverrides.substr(this.buf, p1, this.pos - p1));
			}
			unserializeObject(o) {
				while (true) {
					if (this.pos >= this.length) {
						throw haxe_Exception.thrown("Invalid object");
					}
					if (this.buf.charCodeAt(this.pos) == 103) {
						break;
					}
					let k = this.unserialize();
					if (typeof (k) != "string") {
						throw haxe_Exception.thrown("Invalid object key");
					}
					let v = this.unserialize();
					o[k] = v;
				}
				this.pos++;
			}
			unserializeEnum(edecl, tag) {
				if (this.buf.charCodeAt(this.pos++) != 58) {
					throw haxe_Exception.thrown("Invalid enum format");
				}
				let nargs = this.readDigits();
				if (nargs == 0) {
					return Type.createEnum(edecl, tag);
				}
				let args = [];
				while (nargs-- > 0) args.push(this.unserialize());
				return Type.createEnum(edecl, tag, args);
			}
			unserialize() {
				switch (this.buf.charCodeAt(this.pos++)) {
					case 65:
						let name = this.unserialize();
						let cl = this.resolver.resolveClass(name);
						if (cl == null) {
							throw haxe_Exception.thrown("Class not found " + name);
						}
						return cl;
					case 66:
						let name1 = this.unserialize();
						let e = this.resolver.resolveEnum(name1);
						if (e == null) {
							throw haxe_Exception.thrown("Enum not found " + name1);
						}
						return e;
					case 67:
						let name2 = this.unserialize();
						let cl1 = this.resolver.resolveClass(name2);
						if (cl1 == null) {
							throw haxe_Exception.thrown("Class not found " + name2);
						}
						let o = Object.create(cl1.prototype);
						this.cache.push(o);
						o.hxUnserialize(this);
						if (this.buf.charCodeAt(this.pos++) != 103) {
							throw haxe_Exception.thrown("Invalid custom data");
						}
						return o;
					case 77:
						let h = new haxe_ds_ObjectMap();
						this.cache.push(h);
						let buf = this.buf;
						while (this.buf.charCodeAt(this.pos) != 104) {
							let s = this.unserialize();
							h.set(s, this.unserialize());
						}
						this.pos++;
						return h;
					case 82:
						let n = this.readDigits();
						if (n < 0 || n >= this.scache.length) {
							throw haxe_Exception.thrown("Invalid string reference");
						}
						return this.scache[n];
					case 97:
						let buf1 = this.buf;
						let a = [];
						this.cache.push(a);
						while (true) {
							let c = this.buf.charCodeAt(this.pos);
							if (c == 104) {
								this.pos++;
								break;
							}
							if (c == 117) {
								this.pos++;
								let n = this.readDigits();
								a[a.length + n - 1] = null;
							} else {
								a.push(this.unserialize());
							}
						}
						return a;
					case 98:
						let h1 = new haxe_ds_StringMap();
						this.cache.push(h1);
						let buf2 = this.buf;
						while (this.buf.charCodeAt(this.pos) != 104) {
							let s = this.unserialize();
							let value = this.unserialize();
							h1.h[s] = value;
						}
						this.pos++;
						return h1;
					case 99:
						let name3 = this.unserialize();
						let cl2 = this.resolver.resolveClass(name3);
						if (cl2 == null) {
							throw haxe_Exception.thrown("Class not found " + name3);
						}
						let o1 = Object.create(cl2.prototype);
						this.cache.push(o1);
						this.unserializeObject(o1);
						return o1;
					case 100:
						return this.readFloat();
					case 102:
						return false;
					case 105:
						return this.readDigits();
					case 106:
						let name4 = this.unserialize();
						let edecl = this.resolver.resolveEnum(name4);
						if (edecl == null) {
							throw haxe_Exception.thrown("Enum not found " + name4);
						}
						this.pos++;
						let index = this.readDigits();
						let _this = edecl.__constructs__;
						let result = new Array(_this.length);
						let _g = 0;
						let _g1 = _this.length;
						while (_g < _g1) {
							let i = _g++;
							result[i] = _this[i]._hx_name;
						}
						let tag = result[index];
						if (tag == null) {
							throw haxe_Exception.thrown("Unknown enum index " + name4 + "@" + index);
						}
						let e1 = this.unserializeEnum(edecl, tag);
						this.cache.push(e1);
						return e1;
					case 107:
						return NaN;
					case 108:
						let l = new haxe_ds_List();
						this.cache.push(l);
						let buf3 = this.buf;
						while (this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
						this.pos++;
						return l;
					case 109:
						return -Infinity;
					case 110:
						return null;
					case 111:
						let o2 = {};
						this.cache.push(o2);
						this.unserializeObject(o2);
						return o2;
					case 112:
						return Infinity;
					case 113:
						let h2 = new haxe_ds_IntMap();
						this.cache.push(h2);
						let buf4 = this.buf;
						let c = this.buf.charCodeAt(this.pos++);
						while (c == 58) {
							let i = this.readDigits();
							let value = this.unserialize();
							h2.h[i] = value;
							c = this.buf.charCodeAt(this.pos++);
						}
						if (c != 104) {
							throw haxe_Exception.thrown("Invalid IntMap format");
						}
						return h2;
					case 114:
						let n1 = this.readDigits();
						if (n1 < 0 || n1 >= this.cache.length) {
							throw haxe_Exception.thrown("Invalid reference");
						}
						return this.cache[n1];
					case 115:
						let len = this.readDigits();
						let buf5 = this.buf;
						if (this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) {
							throw haxe_Exception.thrown("Invalid bytes length");
						}
						let codes = haxe_Unserializer.CODES;
						if (codes == null) {
							codes = haxe_Unserializer.initCodes();
							haxe_Unserializer.CODES = codes;
						}
						let i = this.pos;
						let rest = len & 3;
						let size = (len >> 2) * 3 + (rest >= 2 ? rest - 1 : 0);
						let max = i + (len - rest);
						let bytes = new haxe_io_Bytes(new ArrayBuffer(size));
						let bpos = 0;
						while (i < max) {
							let c1 = codes[buf5.charCodeAt(i++)];
							let c2 = codes[buf5.charCodeAt(i++)];
							bytes.b[bpos++] = c1 << 2 | c2 >> 4;
							let c3 = codes[buf5.charCodeAt(i++)];
							bytes.b[bpos++] = c2 << 4 | c3 >> 2;
							let c4 = codes[buf5.charCodeAt(i++)];
							bytes.b[bpos++] = c3 << 6 | c4;
						}
						if (rest >= 2) {
							let c1 = codes[buf5.charCodeAt(i++)];
							let c2 = codes[buf5.charCodeAt(i++)];
							bytes.b[bpos++] = c1 << 2 | c2 >> 4;
							if (rest == 3) {
								let c3 = codes[buf5.charCodeAt(i++)];
								bytes.b[bpos++] = c2 << 4 | c3 >> 2;
							}
						}
						this.pos += len;
						this.cache.push(bytes);
						return bytes;
					case 116:
						return true;
					case 118:
						let d;
						if (this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
							d = HxOverrides.strDate(HxOverrides.substr(this.buf, this.pos, 19));
							this.pos += 19;
						} else {
							d = new Date(this.readFloat());
						}
						this.cache.push(d);
						return d;
					case 119:
						let name5 = this.unserialize();
						let edecl1 = this.resolver.resolveEnum(name5);
						if (edecl1 == null) {
							throw haxe_Exception.thrown("Enum not found " + name5);
						}
						let e2 = this.unserializeEnum(edecl1, this.unserialize());
						this.cache.push(e2);
						return e2;
					case 120:
						throw haxe_Exception.thrown(this.unserialize());
					case 121:
						let len1 = this.readDigits();
						if (this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len1) {
							throw haxe_Exception.thrown("Invalid string length");
						}
						let s = HxOverrides.substr(this.buf, this.pos, len1);
						this.pos += len1;
						s = decodeURIComponent(s.split("+").join(" "));
						this.scache.push(s);
						return s;
					case 122:
						return 0;
					default:
				}
				this.pos--;
				throw haxe_Exception.thrown("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
			}
			static initCodes() {
				let codes = [];
				let _g = 0;
				let _g1 = haxe_Unserializer.BASE64.length;
				while (_g < _g1) {
					let i = _g++;
					codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
				}
				return codes;
			}
		}
		$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
		haxe_Unserializer.__name__ = true;
		class haxe_ValueException extends haxe_Exception {
			constructor(value, previous, native) {
				super(String(value), previous, native);
				this.value = value;
			}
		}
		$hxClasses["haxe.ValueException"] = haxe_ValueException;
		haxe_ValueException.__name__ = true;
		class haxe_ds_IntMap {
			constructor() {
				this.h = {};
			}
		}
		$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
		haxe_ds_IntMap.__name__ = true;
		class haxe_ds_List {
			constructor() {
				this.length = 0;
			}
			add(item) {
				let x = new haxe_ds__$List_ListNode(item, null);
				if (this.h == null) {
					this.h = x;
				} else {
					this.q.next = x;
				}
				this.q = x;
				this.length++;
			}
		}
		$hxClasses["haxe.ds.List"] = haxe_ds_List;
		haxe_ds_List.__name__ = true;
		class haxe_ds__$List_ListNode {
			constructor(item, next) {
				this.item = item;
				this.next = next;
			}
		}
		$hxClasses["haxe.ds._List.ListNode"] = haxe_ds__$List_ListNode;
		haxe_ds__$List_ListNode.__name__ = true;
		class haxe_ds_ObjectMap {
			constructor() {
				this.h = { __keys__: {} };
			}
			set(key, value) {
				let id = key.__id__;
				if (id == null) {
					id = (key.__id__ = $global.$haxeUID++);
				}
				this.h[id] = value;
				this.h.__keys__[id] = key;
			}
		}
		$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
		haxe_ds_ObjectMap.__name__ = true;
		class haxe_ds_StringMap {
			constructor() {
				this.h = Object.create(null);
			}
		}
		$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
		haxe_ds_StringMap.__name__ = true;
		class haxe_io_Bytes {
			constructor(data) {
				this.length = data.byteLength;
				this.b = new Uint8Array(data);
				this.b.bufferValue = data;
				data.hxBytes = this;
				data.bytes = this.b;
			}
		}
		$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
		haxe_io_Bytes.__name__ = true;
		class haxe_iterators_ArrayIterator {
			constructor(array) {
				this.current = 0;
				this.array = array;
			}
			hasNext() {
				return this.current < this.array.length;
			}
			next() {
				return this.array[this.current++];
			}
		}
		$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
		haxe_iterators_ArrayIterator.__name__ = true;
		$global.$haxeUID |= 0;
		if (typeof (performance) != "undefined" ? typeof (performance.now) == "function" : false) {
			HxOverrides.now = performance.now.bind(performance);
		}
		$hxClasses["Math"] = Math;
		{
			String.__name__ = true;
			$hxClasses["Array"] = Array;
			Array.__name__ = true;
			Date.__name__ = "Date";
		}
		haxe_ds_ObjectMap.count = 0;
		haxe_Unserializer.DEFAULT_RESOLVER = new haxe__$Unserializer_DefaultResolver();
		haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
		Test.main();
	})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

}