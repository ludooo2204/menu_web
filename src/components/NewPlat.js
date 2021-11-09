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
	let [platToReadAndUpdate, setPlatToReadAndUpdate] = useState(null);
	useEffect(() => {
		console.log("appel bdd");
		fetch("http://lomano.go.yo.fr/api/menus/getPlats.php")
			// fetch("http://localhost/API_menu/getPlats.php")
			.then((reponse) => reponse.json())
			.then((data) => {
				console.log("data");
				console.log(data);
				setBddPlats(data);
			})

			.catch((fail) => console.log("fail", fail));
		fetch("http://localhost/API_menu/getIngredients.php")
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
		if (!ingredientsChoisi.map((e) => e.nom).includes(item)) setIngredientsChoisi([...ingredientsChoisi, { nom: item, quantité: null, unité: null }]);
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
		fetch("http://localhost/API_menu/postIngredient.php", {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ nom_ingredient: ingredientAAjouter }),
		})
			.then((res) => {
				res.json();
				fetch("http://localhost/API_menu/getIngredients.php")
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
		let platToSave = { platNom, platType, saison, platTypeViande, platMidiSoir, platVitesse, platUrl,platNbrPossible, ingredientsChoisi: ingredientsChoisiString };
		console.log("platToSave");
		console.log(platToSave);
		// fetch("http://localhost/API_menu/postPlat.php", {
		fetch("http://lomano.go.yo.fr/api/menus/postPlat.php", {
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
		setIsChoisirNbrPossibleVisible(false)
	};
	const choisirSaison = (_saison) => {
		console.log(`le choix de la saison est ${_saison}`);
		if (_saison == null) setSaison([]);
		else setSaison([...saison, _saison]);
	};
	const choisirTypePopup = () => {
		setIsChoisirTypeVisible(!isChoisirTypeVisible);
		setIsChoisirSaisonVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false)

	};
	const choisirType = (_type) => {
		console.log(`le choix du type est ${_type}`);
		if (_type == null) setPlatType([]);
		else setPlatType([...platType, _type]);
	};
	const choisirMidiSoirPopup = () => {
		setIsChoisirMidiSoirVisible(!isChoisirMidiSoirVisible);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false)

	};
	const choisirMidiSoir = (_MidiSoir) => {
		console.log(`le choix du MidiSoir est ${_MidiSoir}`);
		if (_MidiSoir == null) setPlatMidiSoir([]);
		else setPlatMidiSoir([...platMidiSoir, _MidiSoir]);
	};
	const choisirVitessePopup = () => {
		setIsChoisirVitesseVisible(!isChoisirVitesseVisible);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
		setIsChoisirTypeViandeVisible(false);
		setIsChoisirNbrPossibleVisible(false)

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
		setIsChoisirNbrPossibleVisible(false)

	};
	const choisirTypeViande = (_TypeViande) => {
		console.log(`le choix du TypeViande est ${_TypeViande}`);
		if (_TypeViande == null) setPlatTypeViande([]);
		else setPlatTypeViande([...platTypeViande, _TypeViande]);
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

const readAndUpdatePlat=(_plat)=>{
	console.log(_plat)
	setPlatToReadAndUpdate(_plat)
}
//composant interne

const ReadAndUpdate=()=>{
	console.log("platToReadAndUpdate")
	console.log(platToReadAndUpdate)
return (
	<div>"coucou"</div>
)
} 

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
						{platTrouvés && platTrouvés.length !== 0 && !platToReadAndUpdate&& (
							<div className="platsTrouvés">
								{platTrouvés.map((plat) => (
									<div className="platTrouvé" onClick={()=>readAndUpdatePlat(plat)}>{plat.nom_plat}</div>
								))}
							</div>
						)}
						{
							platToReadAndUpdate&&(<ReadAndUpdate />)
						}
						{platTrouvés && platTrouvés.length == 0 && <button onClick={ajouterPlat}>Ajouter un nouveau plat</button>}
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
						placeholder={platType.length == 0 ? "Ce plat a t il un type particulier ?" : platType.toString()}
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
						placeholder={platMidiSoir.length == 0 ? "Ce plat est il pour un midi ou le soir ?" : platMidiSoir.toString()}
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
						placeholder={platNbrPossible== 1 ? "Combien de repas possible ? (1 par défaut)" : platNbrPossible.toString()}
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
						placeholder={platTypeViande.length == 0 ? "quel type de viande ce plat possède t il ?" : platTypeViande.toString()}
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
					{console.log(ingredientsChoisi)}
					<input
						// placeholder="quels sont les ingrédients ?"
						placeholder={ingredientsChoisi.length == 0 ? "quels sont les ingrédients ?" : ingredientsChoisi.map((e) => e.nom).toString()}
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
					{ingredientTrouvés && ingredientTrouvés.length == 0 && <button onClick={() => ajouterIngredient(ingredientAAjouter)}>Ajouter un ingredient</button>}
					<br />
					<label>ingredient choisis</label>
					<div className="ingrédientsTrouvéQuantité">
						{ingredientsChoisi.map((item) => (
							<div className="ingredientsItem">
								<div onClick={() => deselectionnerIngredient(item.nom)}>{item.nom}</div>
								<div style={{ display: "flex", justifyContent: "center" }}>
									<input className="inputQuantité" type="number" placeholder="quantité ?" onChange={(e) => handleChangeQuantité(e, item)}></input>
									<select onChange={(e) => handleChangeUnité(e, item)}>
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

					<button onClick={validerNouveauPlat}>VALIDER ?</button>
				</div>
			)}
		</div>
	);
};

export default NewPlat;
