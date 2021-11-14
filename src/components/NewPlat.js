///todo ligne 718 ajout value? pour ajouter les valeurs de quantité et d'unité lors de la lecture d'un plat existant. voir debug ligne419

import React, { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";

const NewPlat = () => {
	let [bddPlats, setBddPlats] = useState(null);
	let [bddIngredients, setBddIngredients] = useState(null);
	let [platTrouvés, setPlatTrouvés] = useState(null);
	let [ingredientTrouvés, setIngredientTrouvés] = useState(null);
	let [isAjoutPlatVisible, setIsAjoutPlatVisible] = useState(false);
	let [isChoisirSaisonVisible, setIsChoisirSaisonVisible] = useState(false);
	let [isChoisirTypeVisible, setIsChoisirTypeVisible] = useState(false);
	let [isChoisirMidiSoirVisible, setIsChoisirMidiSoirVisible] = useState(false);
	let [isChoisirTypeViandeVisible, setIsChoisirTypeViandeVisible] = useState(false);
	let [isChoisirVitesseVisible, setIsChoisirVitesseVisible] = useState(false);
	let [isChoisirNbrPossibleVisible, setIsChoisirNbrPossibleVisible] = useState(false);
	let [ingredientAAjouter, setIngredientAAjouter] = useState(null);
	let [platType, setPlatType] = useState([]);
	let [platUrl, setPlatUrl] = useState("");
	let [platNom, setPlatNom] = useState("");
	let [platMidiSoir, setPlatMidiSoir] = useState([]);
	let [platTypeViande, setPlatTypeViande] = useState([]);
	let [platVitesse, setPlatVitesse] = useState("");
	let [platNbrPossible, setPlatNbrPossible] = useState(1);
	let [ingredientsChoisi, setIngredientsChoisi] = useState([]);
	let [saison, setSaison] = useState([]);
	let [modeUpdate, setModeUpdate] = useState(false);
	let [id, setId] = useState("");
	let [isHover, setHover] = useState(false);
	let [hoverPlat, setHoverPlat] = useState(null);

	useEffect(() => {
		console.log("appel bdd");
		fetch("https://lomano.go.yo.fr/api/menus/getPlats.php")
			// fetch("https://localhost/API_menu/getPlats.php")
			.then((reponse) => reponse.json())
			.then((data) => {
				console.log("data");
				console.log(data);
				setBddPlats(data);
			})

			.catch((fail) => console.log("fail", fail));
		fetch("https://lomano.go.yo.fr/api/menus/getIngredients.php")
			// fetch("https://localhost/API_menu/getIngredients.php")
			.then((reponse) => reponse.json())
			.then((data) => {
				console.log("dataIngredients");
				console.log(data);
				setBddIngredients([...new Set(data.map((plat) => plat.nom_ingredient))]);
			})
			.catch((fail) => console.log("fail", fail));
	}, []);

	const recherchePlat = (plat) => {
		console.log(plat.target.value);
		console.log(bddPlats);
		if (plat.target.value != "") {
			const resultatDeRecherche = matchSorter(bddPlats, plat.target.value, { keys: ["nom_plat"], threshold: matchSorter.rankings.CONTAINS });
			console.log(resultatDeRecherche);
			setPlatTrouvés(resultatDeRecherche);
			setPlatNom(plat.target.value);
		} else setPlatTrouvés(null);
	};

	const rechercheIngredient = (plat) => {
		console.log(plat.target.value);
		console.log(bddIngredients);
		const resultatDeRecherche = matchSorter(bddIngredients, plat.target.value, { threshold: matchSorter.rankings.CONTAINS });
		console.log(resultatDeRecherche);
		setIngredientTrouvés(resultatDeRecherche);
		setIngredientAAjouter(plat.target.value);
	};

	const choisirIngredient = (item) => {
		console.log("ingredientsChoisi", ingredientsChoisi);
		console.log("item", item);
		if (!ingredientsChoisi.map((e) => e.nom).includes(item) || ingredientsChoisi == "undefined") setIngredientsChoisi([...ingredientsChoisi, { nom: item, quantité: null, unité: null }]);
	};

	const deselectionnerIngredient = (item) => {
		for (let i = 0; i < ingredientsChoisi.length; i++) {
			const element = ingredientsChoisi[i];
			if (element.nom == item) ingredientsChoisi.splice(i, 1);
		}
		setIngredientsChoisi([...ingredientsChoisi]);
	};

	const ajouterPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);
	};

	const ajouterIngredient = () => {
		fetch("https://lomano.go.yo.fr/api/menus/postIngredient.php", {
			// fetch("https://localhost/API_menu/postIngredient.php", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ nom_ingredient: ingredientAAjouter }),
		})
			.then((res) => {
				res.json();
				// fetch("https://localhost/API_menu/getIngredients.php")
				fetch("https://lomano.go.yo.fr/api/menus/getIngredients.php")
					.then((reponse) => reponse.json())
					.then((data) => {
						console.log("dataIngredients");
						console.log(data);
						setBddIngredients([...new Set(data.map((plat) => plat.nom_ingredient))]);
					})
					.catch((fail) => console.log("fail", fail));

				choisirIngredient(ingredientAAjouter);
				alert("l'ingrédient a été ajouté");
			})
			.then((res) => {
				console.log(res);
			});
	};
	const validerNouveauPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);
		let ingredientsChoisiString = "";
		for (const iterator of ingredientsChoisi) {
			ingredientsChoisiString += iterator.nom;
			ingredientsChoisiString += ",";
			ingredientsChoisiString += iterator.quantité;
			ingredientsChoisiString += ",";
			ingredientsChoisiString += iterator.unité;
			ingredientsChoisiString += ",";
		}
		let platToSave = { platNom, platType, saison, platTypeViande, platMidiSoir, platVitesse, platUrl, platNbrPossible, ingredientsChoisi: ingredientsChoisiString };
		console.log("platToSave");
		console.log(platToSave);
		// fetch("https://localhost/API_menu/postPlat.php", {
		fetch("https://lomano.go.yo.fr/api/menus/postPlat.php", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(platToSave),
		})
			.then((res) => {
				res.json();
				console.log("tout va bien");
				setPlatNom("");
				setPlatType([]);
				setSaison([]);
				setPlatTypeViande([]);
				setPlatNbrPossible(1);
				setPlatMidiSoir([]);
				setPlatVitesse("");
				setPlatUrl("");
				setIngredientsChoisi([]);
				setIngredientTrouvés(null);
				alert("Le plat a bien été ajouté !");
				window.location.reload();
				// .then((res) => {
				// 	console.log(res);
			})
			.catch((err) => console.log("err,err"));
	};
	const choisirSaisonPopup = () => {
		setIsChoisirSaisonVisible(!isChoisirSaisonVisible);
		setIsChoisirTypeVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false);
	};

	const choisirSaison = (_saison) => {
		console.log(`le choix de la saison est ${_saison}`);
		if (!saison.includes(_saison)) {
			if (!modeUpdate) {
				if (_saison == null) setSaison([]);
				else setSaison([...saison, _saison]);
			} else {
				let typeSaison;
				if (typeof saison == "string") {
					typeSaison = saison.split(",");

					typeSaison.push(_saison);
					console.log(typeSaison);
					setSaison(typeSaison);
				} else if (saison == null && _saison != null) {
					console.log("null");
					setSaison([_saison]);
				} else if (_saison == null) {
					console.log("null");
					setSaison([]);
				} else {
					console.log("array PAR DEFAAAUT");
					setSaison([...saison, _saison]);
				}
			}
		}
	};

	const choisirTypePopup = () => {
		setIsChoisirTypeVisible(!isChoisirTypeVisible);
		setIsChoisirSaisonVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false);
	};
	const choisirType = (_type) => {
		console.log(`le choix du type est ${_type}`);
		if (!platType.includes(_type)) {
			if (!modeUpdate) {
				if (_type == null) setPlatType([]);
				else setPlatType([...platType, _type]);
			} else {
				let type;
				if (typeof platType == "string") {
					type = platType.split(",");

					type.push(_type);
					console.log(type);
					setPlatType(type);
				} else if (platType == null && _type != null) {
					console.log("null");
					setPlatType([_type]);
				} else if (_type == null) {
					console.log("null");
					setPlatType([]);
				} else {
					console.log("array");
					setPlatType([...platType, _type]);
				}
			}
		}
	};
	const choisirMidiSoirPopup = () => {
		setIsChoisirMidiSoirVisible(!isChoisirMidiSoirVisible);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false);
	};
	const choisirMidiSoir = (_MidiSoir) => {
		console.log("_MidiSoir");
		console.log(_MidiSoir);
		console.log(platMidiSoir);
		console.log(typeof platMidiSoir);
		if (!platMidiSoir.includes(_MidiSoir)) {
			if (!modeUpdate) {
				if (_MidiSoir == null) setPlatMidiSoir([]);
				else setPlatMidiSoir([...platMidiSoir, _MidiSoir]);
			} else {
				let typeMidiSoir;
				if (typeof platMidiSoir == "string") {
					typeMidiSoir = platMidiSoir.split(",");

					typeMidiSoir.push(_MidiSoir);
					console.log(typeMidiSoir);
					setPlatMidiSoir(typeMidiSoir);
				} else if (platMidiSoir == null && _MidiSoir != null) {
					console.log("null");
					setPlatMidiSoir([_MidiSoir]);
				} else if (_MidiSoir == null) {
					console.log("null");
					setPlatMidiSoir([]);
				} else {
					console.log("array PAR DEFAAAUT");
					setPlatMidiSoir([...platMidiSoir, _MidiSoir]);
				}
			}
		}
	};
	const choisirVitessePopup = () => {
		setIsChoisirVitesseVisible(!isChoisirVitesseVisible);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false);
	};
	const choisirVitesse = (_Vitesse) => {
		console.log(`le choix du Vitesse est ${_Vitesse}`);
		// if (_Vitesse==null) setPlatVitesse([])
		setPlatVitesse(_Vitesse);
	};
	const choisirNbrPossiblePopup = () => {
		setIsChoisirNbrPossibleVisible(!isChoisirNbrPossibleVisible);
		setIsChoisirVitesseVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirTypeViandeVisible(false);
	};
	const choisirNbrPossible = (_nbr) => {
		// if (_Vitesse==null) setPlatVitesse([])
		setPlatNbrPossible(_nbr);
	};
	const choisirTypeViandePopup = () => {
		setIsChoisirTypeViandeVisible(!isChoisirTypeViandeVisible);
		setIsChoisirVitesseVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirNbrPossibleVisible(false);
	};

	const choisirTypeViande = (_TypeViande) => {
		console.log(`le choix du TypeViande est ${_TypeViande}`);
		console.log("platTypeViande");
		console.log(platTypeViande);
		// if (_TypeViande == null) setPlatTypeViande([]);
		if (!platTypeViande.includes(_TypeViande)) {
			if (!modeUpdate) {
				if (_TypeViande == null) setPlatTypeViande([]);
				else setPlatTypeViande([...platTypeViande, _TypeViande]);
			} else {
				let typeViande;
				if (typeof platTypeViande == "string") {
					typeViande = platTypeViande.split(",");
					typeViande.push(_TypeViande);
					console.log("coucou");
					console.log(typeViande);
					setPlatTypeViande(typeViande);
				} else if (platTypeViande == null && _TypeViande != null) {
					console.log("null");
					setPlatTypeViande([_TypeViande]);
				} else if (_TypeViande == null) {
					console.log("null");
					setPlatTypeViande([]);
				} else {
					console.log("array");
					setPlatTypeViande([...platTypeViande, _TypeViande]);
				}
			}
		}
	};

	const choisirUrl = (_url) => {
		if (_url.target.value == null) setPlatUrl("");
		else setPlatUrl(_url.target.value);
	};
	const choisirNomPlat = (_nom) => {
		if (_nom.target.value == null) setPlatNom("");
		else setPlatNom(_nom.target.value);
	};
	const handleChangeQuantité = (e, item) => {
		console.log(e.target.value);
		console.log(item);
		const copie = [...ingredientsChoisi];
		copie[ingredientsChoisi.indexOf(item)].quantité = e.target.value;
		setIngredientsChoisi([...copie]);
	};
	const handleChangeUnité = (e, item) => {
		console.log(e.target.value);
		console.log(item);
		console.log(ingredientsChoisi.indexOf(item));
		console.log(ingredientsChoisi);
		const copie = [...ingredientsChoisi];
		copie[ingredientsChoisi.indexOf(item)].unité = e.target.value;
		setIngredientsChoisi([...copie]);
	};

	const supprimerPlat = () => {
		console.log("SUPPRESIIO?");
		console.log("id =>", id);

		fetch("https://lomano.go.yo.fr/api/menus/deletePlat.php", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: id,
		})
			.then((res) => {
				res.json();
				console.log("tout va bien");

				alert("Le plat a bien été supprimé !");
				window.location.reload();
				// .then((res) => {
				// 	console.log(res);
			})
			.catch((err) => console.log("err,err"));
	};
	const hover = (_plat) => {
		console.log(_plat);
		if (_plat.ingredients) {
			const arrayIngredients = _plat.ingredients.split(",");
			arrayIngredients.pop();
			console.log(arrayIngredients);
			let stringIngredients=""
			if (arrayIngredients.length>0)		stringIngredients += arrayIngredients[1]+" "+arrayIngredients[2]+" de "+arrayIngredients[0]
			if (arrayIngredients.length>3)		stringIngredients +=" ; "+ arrayIngredients[4]+" "+arrayIngredients[5]+" de "+arrayIngredients[3]
			if (arrayIngredients.length>6)		stringIngredients +=" ; "+ arrayIngredients[7]+" "+arrayIngredients[8]+" de "+arrayIngredients[6]
			if (arrayIngredients.length>9)		stringIngredients +=" ; "+ arrayIngredients[10]+" "+arrayIngredients[11]+" de "+arrayIngredients[9]
			if (arrayIngredients.length>12)		stringIngredients +=" ; "+ arrayIngredients[13]+" "+arrayIngredients[14]+" de "+arrayIngredients[12]
			if (arrayIngredients.length>15)		stringIngredients +=" ; "+ arrayIngredients[16]+" "+arrayIngredients[17]+" de "+arrayIngredients[15]
			if (arrayIngredients.length>18)		stringIngredients +=" ; "+ arrayIngredients[19]+" "+arrayIngredients[20]+" de "+arrayIngredients[18]
			if (arrayIngredients.length>21)		stringIngredients +=" ; "+ arrayIngredients[22]+" "+arrayIngredients[23]+" de "+arrayIngredients[21]
			if (arrayIngredients.length>24)		stringIngredients +=" ; "+ arrayIngredients[25]+" "+arrayIngredients[26]+" de "+arrayIngredients[24]
			if (arrayIngredients.length>27)		stringIngredients +=" ; "+ arrayIngredients[28]+" "+arrayIngredients[29]+" de "+arrayIngredients[27]
			console.log(stringIngredients)
			_plat.stringIngredients=stringIngredients
		}
		setHover(true);
		setHoverPlat(_plat);
	};
	const modifierPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);
		let ingredientsChoisiString = "";
		console.log(ingredientsChoisi);
		console.log(ingredientsChoisi);
		console.log(ingredientsChoisi);
		if (ingredientsChoisi) {
			for (const iterator of ingredientsChoisi) {
				ingredientsChoisiString += iterator.nom;
				ingredientsChoisiString += ",";
				ingredientsChoisiString += iterator.quantité;
				ingredientsChoisiString += ",";
				ingredientsChoisiString += iterator.unité;
				ingredientsChoisiString += ",";
			}
		}
		let platToSave = { platNom, platType, saison, platTypeViande, platMidiSoir, platVitesse, platUrl, platNbrPossible, ingredientsChoisi: ingredientsChoisiString, id };
		console.log("platToSave");
		console.log(platToSave);
		// fetch("httpss://localhost/API_menu/postPlat.php", {
		fetch("httpss://lomano.go.yo.fr/api/menus/updatePlat.php", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(platToSave),
		})
			.then((res) => {
				res.json();
				console.log("tout va bien");
				// setPlatNom("");
				// setPlatType([]);
				// setSaison([]);
				// setPlatTypeViande([]);
				// setPlatNbrPossible(1);
				// setPlatMidiSoir([]);
				// setPlatVitesse("");
				// setPlatUrl("");
				// setIngredientsChoisi([]);
				// setIngredientTrouvés(null);
				alert("Le plat a bien été modifié !");
				window.location.reload();
				// .then((res) => {
				// 	console.log(res);
			})
			.catch((err) => console.log("err,err"));
	};

	const readAndUpdatePlat = (_plat) => {
		console.log(_plat);
		console.log("typeof _plat.saison");
		console.log(typeof _plat.saison);
		let testIng;
		if (_plat.ingredients) {
			const test = _plat.ingredients.split(",");
			test.pop();
			console.log(test);
			console.log(test.length / 3);
			if (test.length / 3 == 1) {
				testIng = [{ nom: test[0], quantité: test[1], unité: test[2] }];
			}
			if (test.length / 3 == 2) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
				];
			}
			if (test.length / 3 == 3) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
				];
			}
			if (test.length / 3 == 4) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
					{ nom: test[9], quantité: test[10], unité: test[11] },
				];
			}
			if (test.length / 3 == 5) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
					{ nom: test[9], quantité: test[10], unité: test[11] },
					{ nom: test[12], quantité: test[13], unité: test[14] },
				];
			}
			if (test.length / 3 == 6) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
					{ nom: test[9], quantité: test[10], unité: test[11] },
					{ nom: test[12], quantité: test[13], unité: test[14] },
					{ nom: test[15], quantité: test[16], unité: test[17] },
				];
			}
			if (test.length / 3 == 7) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
					{ nom: test[9], quantité: test[10], unité: test[11] },
					{ nom: test[12], quantité: test[13], unité: test[14] },
					{ nom: test[15], quantité: test[16], unité: test[17] },
					{ nom: test[18], quantité: test[19], unité: test[20] },
				];
			}
			if (test.length / 3 == 8) {
				testIng = [
					{ nom: test[0], quantité: test[1], unité: test[2] },
					{ nom: test[3], quantité: test[4], unité: test[5] },
					{ nom: test[6], quantité: test[7], unité: test[8] },
					{ nom: test[9], quantité: test[10], unité: test[11] },
					{ nom: test[12], quantité: test[13], unité: test[14] },
					{ nom: test[15], quantité: test[16], unité: test[17] },
					{ nom: test[18], quantité: test[19], unité: test[20] },
					{ nom: test[21], quantité: test[22], unité: test[23] },
				];
			}
			console.log(testIng);
		}

		if (typeof _plat.saison == "string") _plat.saison = [_plat.saison];
		if (typeof _plat.typeViande == "string") _plat.typeViande = [_plat.typeViande];
		if (typeof _plat.midiSoir == "string") _plat.midiSoir = [_plat.midiSoir];
		if (typeof _plat.typePlat == "string") _plat.typePlat = [_plat.typePlat];

		console.log("typeof _plat.saison");
		console.log(typeof _plat.saison);
		console.log(_plat.saison);
		setIsAjoutPlatVisible(true);
		setPlatNom(_plat.nom_plat);
		setPlatType(_plat.typePlat == "" ? null : _plat.typePlat);
		setSaison(_plat.saison == null ? [] : _plat.saison);
		setPlatTypeViande(_plat.typeViande);
		setPlatNbrPossible(_plat.nbrDeRepasPossible == null ? 1 : _plat.nbrDeRepasPossible);
		setPlatMidiSoir(_plat.midiSoir);
		setPlatVitesse(_plat.tempsDePreparation);
		setPlatUrl(_plat.url == null ? "" : _plat.url);
		setIngredientsChoisi(_plat.ingredients == null ? "" : testIng);
		setId(_plat.id);
		setModeUpdate(true);

		console.log(_plat.id);
	};
	//composant interne

	return (
		<div>
			{!isAjoutPlatVisible && (
				<div className="recherchePlat">
					<div>
						<input
							placeholder="rechercher un plat"
							onChange={(platName) => recherchePlat(platName)}
							maxLength={225}
							multiline="true"
							style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
						/>
						{isHover && (
							<div className="hovered">
								<div style={{ fontWeight: 900, fontSize: 30 }}>{hoverPlat.nom_plat}</div>
								<div>
									<span className="titreHover">ingredient :</span>
									<span>{hoverPlat.stringIngredients}</span>
								</div>
								<div>
									<span className="titreHover">saison :</span>
									<span>{hoverPlat.saison}</span>
								</div>
								<div>
									<span className="titreHover">nbrDeRepasPossible :</span>
									<span>{hoverPlat.nbrDeRepasPossible}</span>
								</div>
								<div>
									<span className="titreHover">midiSoir :</span>
									<span>{hoverPlat.midiSoir}</span>
								</div>
								<div>
									<span className="titreHover">tempsDePreparation :</span>
									<span>{hoverPlat.tempsDePreparation}</span>
								</div>
								<div>
									<span className="titreHover">recette :</span>
									<a target="_blank" href={hoverPlat.url}>{hoverPlat.url}</a>
								</div>
								<div>
									<button className="titreHover" onClick={() => setHover(false)} style={{marginTop:"5%"}}>Fermer</button>
								</div>
								{/* <div>{hoverPlat.saison}</div>
								<div>{hoverPlat.nbrDeRepasPossible}</div>
								<div>{hoverPlat.midiSoir}</div>
								<div>{hoverPlat.tempsDePreparation}</div>
								<div>{hoverPlat.url}</div> */}
							</div>
						)}

						{platTrouvés && platTrouvés.length !== 0 && (
							<div className="platsTrouvés">
								{platTrouvés.map((plat) => (
									<div className="platTrouvé" onClick={() => readAndUpdatePlat(plat)} onMouseEnter={() => hover(plat)}
									//  onMouseLeave={() => setHover(false)}
									 >
										{plat.nom_plat}
									</div>
								))}
							</div>
						)}

						{platTrouvés && <button style={{position:"fixed",bottom:"5%",left:"40%"}} onClick={ajouterPlat}>Ajouter un nouveau plat</button>}
						<br />
					</div>
				</div>
			)}
			{isAjoutPlatVisible && (
				<div className="newPlat">
					<label>Nom du plat</label>
					<br />
					<input
						placeholder={platNom == "" ? "Comment s'appelle ce nouveau plat ?" : platNom.toString()}
						onChange={(nom) => choisirNomPlat(nom)}
						// placeholder="Comment s'appelle ce nouveau plat ?"
						maxLength={225}
						multiline="true"
						autoFocus
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />

					<label>Saison</label>
					<br />
					{console.log(saison)}
					<input
						placeholder={saison.length == 0 ? "Ce plat correspond t il à une saison particuliere ?" : saison.toString()}
						onFocus={choisirSaisonPopup}
						maxLength={225}
						multiline="true"
						// onBlur={() => setIsChoisirSaisonVisible(false)}
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					{isChoisirSaisonVisible && (
						<div>
							<button onClick={() => choisirSaison("été")}>été</button>
							<button onClick={() => choisirSaison("automne")}>automne</button>
							<button onClick={() => choisirSaison("hiver")}>hiver</button>
							<button onClick={() => choisirSaison("printemps")}>printemps</button>
							<button onClick={() => choisirSaison(null)}>RAZ</button>
							{/* <button onClick={() => choisirSaison(null)}>Pas de saison particulière</button> */}
						</div>
					)}
					<label>Type</label>
					<br />
					<input
						placeholder={!platType || platType.length == 0 ? "Ce plat a t il un type particulier ?" : platType.toString()}
						onFocus={choisirTypePopup}
						maxLength={225}
						multiline="true"
						// onBlur={() => setIsChoisirTypeVisible(false)}
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					{/* '0=defaut 1=tarte 2=vegetarien 3=light 4=extra' */}
					{isChoisirTypeVisible && (
						<div>
							<button onClick={() => choisirType("tarte")}>tarte</button>
							<button onClick={() => choisirType("vegetarien")}>vegetarien</button>
							<button onClick={() => choisirType("light")}>light</button>
							<button onClick={() => choisirType("extra")}>extra</button>
							<button onClick={() => choisirType(null)}>RAZ</button>
						</div>
					)}
					<label>Midi/Soir</label>
					<br />
					<input
						placeholder={!platMidiSoir || platMidiSoir.length == 0 ? "Ce plat est il pour un midi ou le soir ?" : platMidiSoir.toString()}
						maxLength={225}
						onFocus={choisirMidiSoirPopup}
						multiline="true"
						// onBlur={() => setIsChoisirMidiSoirVisible(false)}
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirMidiSoirVisible && (
						<div>
							<button onClick={() => choisirMidiSoir("midi")}>midi</button>
							<button onClick={() => choisirMidiSoir("soir")}>soir</button>
							<button onClick={() => choisirMidiSoir(null)}>RAZ</button>
						</div>
					)}
					<br />
					<label>Préparation</label>
					<br />
					<input
						placeholder={platVitesse.length == 0 ? "Ce plat est il rapide a préparer ?" : platVitesse.toString()}
						maxLength={225}
						onFocus={choisirVitessePopup}
						// onBlur={() => setIsChoisirVitesseVisible(false)}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirVitesseVisible && (
						<div>
							<button onClick={() => choisirVitesse("aucune préparation")}>aucune préparation</button>
							<button onClick={() => choisirVitesse("rapide")}>rapide</button>
							<button onClick={() => choisirVitesse("y a pas mal de boulot")}>y a pas mal de boulot</button>
							<button onClick={() => choisirVitesse("La plus grosse préparation")}>La plus grosse préparation</button>
						</div>
					)}
					<br />

					<label>Nombre de repas possible</label>
					<br />
					<input
						placeholder={platNbrPossible == 1 ? "Combien de repas possible ? (1 par défaut)" : platNbrPossible.toString()}
						maxLength={225}
						onFocus={choisirNbrPossiblePopup}
						multiline="true"
						// onBlur={() => setIsChoisirNbrPossibleVisible(false)}
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirNbrPossibleVisible && (
						<div>
							<button onClick={() => choisirNbrPossible(1)}>1</button>
							<button onClick={() => choisirNbrPossible(2)}>2</button>
							<button onClick={() => choisirNbrPossible(3)}>3</button>
						</div>
					)}
					<br />

					<label>Type de viande</label>
					<br />
					<input
						placeholder={!platTypeViande || platTypeViande.length == 0 ? "quel type de viande ce plat possède t il ?" : platTypeViande.toString()}
						maxLength={225}
						onFocus={choisirTypeViandePopup}
						multiline="true"
						// onBlur={() => setIsChoisirTypeViandeVisible(false)}
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirTypeViandeVisible && (
						<div>
							<button onClick={() => choisirTypeViande("dinde")}>dinde</button>
							<button onClick={() => choisirTypeViande("poulet")}>poulet</button>
							<button onClick={() => choisirTypeViande("boeuf")}>boeuf</button>
							<button onClick={() => choisirTypeViande("porc")}>porc</button>
							<button onClick={() => choisirTypeViande("végétarien")}>végétarien</button>
							<button onClick={() => choisirTypeViande(null)}>RAZ</button>
						</div>
					)}
					<br />

					<label>Recette</label>
					<br />
					<input
						placeholder={platUrl == "" ? "Ce plat a t il une recette en ligne ?" : platUrl.toString()}
						onChange={(url) => choisirUrl(url)}
						maxLength={225}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					<label>Ingrédients</label>
					<br />
					<input
						// placeholder="quels sont les ingrédients ?"
						placeholder={!ingredientsChoisi || ingredientsChoisi.length == 0 ? "quels sont les ingrédients ?" : ingredientsChoisi.map((e) => e.nom).toString()}
						onChange={(platName) => rechercheIngredient(platName)}
						maxLength={225}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					<div className="ingrédientsTrouvé">
						{ingredientTrouvés &&
							ingredientTrouvés.map((ingredient) => (
								<div className="ingrédientTrouvé" onClick={() => choisirIngredient(ingredient)}>
									{ingredient}
								</div>
							))}
					</div>
					{ingredientTrouvés && <button onClick={() => ajouterIngredient(ingredientAAjouter)}>Ajouter un ingredient</button>}
					<br />
					<label>ingredient choisis</label>
					{console.log(ingredientsChoisi)}
					<div className="ingrédientsTrouvéQuantité">
						{ingredientsChoisi &&
							ingredientsChoisi.map((item, index) => (
								<div className="ingredientsItem">
									<div onClick={() => deselectionnerIngredient(item.nom)}>{item.nom}</div>
									<div style={{ display: "flex", justifyContent: "center" }}>
										<input
											className="inputQuantité"
											type="number"
											placeholder="quantité ?"
											value={ingredientsChoisi[index].quantité}
											onChange={(e) => handleChangeQuantité(e, item)}
										></input>
										<select onChange={(e) => handleChangeUnité(e, item)} value={ingredientsChoisi[index].unité}>
											<option>unité à choisir</option>
											<option>ml</option>
											<option>cl</option>
											<option>dl</option>
											<option>l</option>
											<option>grammes</option>
											<option>unité</option>
										</select>
									</div>
								</div>
							))}
					</div>
					<br />
					<br />

					{modeUpdate ? (
						<div>
							<button onClick={modifierPlat}>MODIFIER ?</button>
							<button onClick={supprimerPlat}>SUPPRIMER ?</button>{" "}
						</div>
					) : (
						<button onClick={validerNouveauPlat}>VALIDER ?</button>
					)}
				</div>
			)}
		</div>
	);
};

export default NewPlat;
