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
	let [ingredientAAjouter, setIngredientAAjouter] = useState(null);
	let [platName, setPlatName] = useState("");
	let [platType, setPlatType] = useState([]);
	let [platMidiSoir, setPlatMidiSoir] = useState([]);
	let [platTypeViande, setPlatTypeViande] = useState([]);
	let [platVitesse, setPlatVitesse] = useState([]);
	let [ingredientsChoisi, setIngredientsChoisi] = useState([]);
	let [saison, setSaison] = useState([]);
	let [typeViande, setTypeViande] = useState("");
	let [platNbrPossible, setPlatNbrPossible] = useState("");
	useEffect(() => {
		console.log("appel bdd");
		fetch("http://localhost/API_menu/getPlats.php")
			.then((reponse) => reponse.json())
			.then((data) => {
				console.log("data");
				console.log(data);
				const platUnique = new Set(data.map((plat) => plat.nom_plat));
				let platsAvecIngredient = [];
				for (const iterator of platUnique) {
					let ingredients = [];
					for (const iterator2 of data) {
						if (iterator2.nom_plat == iterator) ingredients.push(iterator2.nom_ingredient);
					}
					// console.log(iterator);
					const platAvecIngredient = data.filter((e) => e.nom_plat == iterator)[0];
					platsAvecIngredient.push({
						nom_plat: platAvecIngredient.nom_plat,
						féculentsConseillés: platAvecIngredient.féculentsConseillés,
						légumesConseillés: platAvecIngredient.légumesConseillés,
						midiSoir: platAvecIngredient.midiSoir,
						nbrDeRepasPossible: platAvecIngredient.nbrDeRepasPossible,
						ingredients,
						saison: platAvecIngredient.saison,
						tempsDePreparation: platAvecIngredient.tempsDePreparation,
						typePlat: platAvecIngredient.typePlat,
						typeViande: platAvecIngredient.typeViande,
					});
					// console.log(platsAvecIngredient);
				}
				setBddPlats(platsAvecIngredient);
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

	useEffect(() => {
		if (bddPlats) {
			console.log(bddPlats);
		}
	}, [bddPlats]);
	const recherchePlat = (plat) => {
		const resultatDeRecherche = matchSorter(bddPlats, plat.target.value, { keys: ["nom_plat"], threshold: matchSorter.rankings.CONTAINS });
		console.log(resultatDeRecherche);
		setPlatTrouvés(resultatDeRecherche);
	};
	const rechercheIngredient = (plat) => {
		console.log(plat.target.value);
		console.log(bddIngredients);
		const resultatDeRecherche = matchSorter(bddIngredients, plat.target.value, { threshold: matchSorter.rankings.CONTAINS });
		console.log(resultatDeRecherche);
		setIngredientTrouvés(resultatDeRecherche);
		setIngredientAAjouter(plat.target.value);
	};
	console.log("ingredientAAjouter", ingredientAAjouter);
	const choisirIngredient = (item) => {
		if (!ingredientsChoisi.includes(item)) setIngredientsChoisi([...ingredientsChoisi, { nom: item, quantité: null, unité: null }]);
	};
	const deselectionnerIngredient = (item) => {
		// const copie=[...ingredientsChoisi]
		console.log(item);
		console.log(ingredientsChoisi);
		for (let i = 0; i < ingredientsChoisi.length; i++) {
			const element = ingredientsChoisi[i];
			if (element.nom == item) ingredientsChoisi.splice(i, 1);
		}
		// console.log(copie)
		// console.log(elementSupprimé)
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
			.then((res) => res.json())
			.then((res) => console.log(res));
	};
	const validerNouveauPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);

		console.log([platType, saison, platTypeViande, platMidiSoir, platVitesse, ingredientsChoisi]);
	};
	const choisirSaisonPopup = () => {
		setIsChoisirSaisonVisible(!isChoisirSaisonVisible);
		setIsChoisirTypeVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirVitesseVisible(false);
		setIsChoisirTypeViandeVisible(false);
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
	};
	const choisirVitesse = (_Vitesse) => {
		console.log(`le choix du Vitesse est ${_Vitesse}`);
		// if (_Vitesse==null) setPlatVitesse([])
		setPlatVitesse(_Vitesse);
	};
	const choisirTypeViandePopup = () => {
		setIsChoisirTypeViandeVisible(!isChoisirTypeViandeVisible);
		setIsChoisirVitesseVisible(false);
		setIsChoisirMidiSoirVisible(false);
		setIsChoisirTypeVisible(false);
		setIsChoisirSaisonVisible(false);
	};
	const choisirTypeViande = (_TypeViande) => {
		console.log(`le choix du TypeViande est ${_TypeViande}`);
		if (_TypeViande == null) setPlatTypeViande([]);
		else setPlatTypeViande([...platTypeViande, _TypeViande]);
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
	return (
		<div style={{ flex: 1, backgroundColor: "blue" }}>
			{!isAjoutPlatVisible && (
				<div className="recherchePlat">
					<div>
					<div className="platsTrouvés">{platTrouvés && platTrouvés.map((plat) => <div>{plat.nom_plat}</div>)}</div>
					<input
						placeholder="recherche de plat existant"
						onChange={(platName) => recherchePlat(platName)}
						maxLength={225}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<button onClick={ajouterPlat}>Ajouter un plat</button>
					<br />
					</div>
				</div>
			)}
			{isAjoutPlatVisible && (
				<div>
					<label>Nom du plat</label>
					<br />
					<input placeholder="Comment s'appelle ce nouveau plat ?" maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />

					<label>Saison</label>
					<br />
					<input
						placeholder={saison.length == 0 ? "Ce plat correspond t il à une saison particuliere ?" : saison.toString()}
						onFocus={choisirSaisonPopup}
						maxLength={225}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					{isChoisirSaisonVisible && (
						<div>
							<button onClick={() => choisirSaison("été")}>été</button>
							<button onClick={() => choisirSaison("automne")}>automne</button>
							<button onClick={() => choisirSaison("hiver")}>hiver</button>
							<button onClick={() => choisirSaison("printemps")}>printemps</button>
							<button onClick={() => choisirSaison(null)}>Pas de saison particulière</button>
						</div>
					)}
					<label>Type</label>
					<br />
					<input
						placeholder={platType.length == 0 ? "Ce plat a t il un type particulier ?" : platType.toString()}
						onFocus={choisirTypePopup}
						maxLength={225}
						multiline="true"
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
							<button onClick={() => choisirType(null)}>Pas de type particulier</button>
						</div>
					)}
					<label>Midi/Soir</label>
					<br />
					<input
						placeholder={platMidiSoir.length == 0 ? "Ce plat est il pour un midi ou le soir ?" : platMidiSoir.toString()}
						maxLength={225}
						onFocus={choisirMidiSoirPopup}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirMidiSoirVisible && (
						<div>
							<button onClick={() => choisirMidiSoir("midi")}>midi</button>
							<button onClick={() => choisirMidiSoir("soir")}>soir</button>
							<button onClick={() => choisirMidiSoir(null)}>peu importe</button>
						</div>
					)}
					<br />
					<label>Préparation</label>
					<br />
					<input
						placeholder={platVitesse.length == 0 ? "Ce plat est il rapide a préparer ?" : platVitesse.toString()}
						maxLength={225}
						onFocus={choisirVitessePopup}
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

					<label>Type de viande</label>
					<br />
					<input
						placeholder={platTypeViande.length == 0 ? "quel type de viande ce plat possède t il ?" : platTypeViande.toString()}
						maxLength={225}
						onFocus={choisirTypeViandePopup}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					{isChoisirTypeViandeVisible && (
						<div>
							<button onClick={() => choisirTypeViande("dinde")}>dinde</button>
							<button onClick={() => choisirTypeViande("poulet")}>poulet</button>
							<button onClick={() => choisirTypeViande("boeuf")}>boeuf</button>
							<button onClick={() => choisirTypeViande("porc")}>porc</button>
							<button onClick={() => choisirTypeViande("végétarien")}>végétarien</button>
							<button onClick={() => choisirTypeViande(null)}>peu importe</button>
						</div>
					)}
					<br />

					<label>Recette</label>
					<br />
					<input placeholder="Ce plat a t il une recette en ligne ?" maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />
					<label>Ingrédients</label>
					<br />
					<div style={{ backgroundColor: "grey" }}>
						{ingredientTrouvés &&
							ingredientTrouvés.map((ingredient) => (
								<div>
									<div onClick={() => choisirIngredient(ingredient)}>{ingredient}</div>
									<br />
								</div>
							))}
					</div>
					<input
						placeholder="quels sont les ingrédients ?"
						onChange={(platName) => rechercheIngredient(platName)}
						maxLength={225}
						multiline="true"
						style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }}
					/>
					<br />
					{ingredientTrouvés && ingredientTrouvés.length == 0 && <button onClick={() => ajouterIngredient(ingredientAAjouter)}>Ajouter un ingredient</button>}
					<br />
					<label>ingredient choisis</label>
					<div style={{ display: "flex", flexDirection: "column" }}>
						{ingredientsChoisi.map((item) => (
							<div className="ingredientsItem">
								<div onClick={() => deselectionnerIngredient(item.nom)}>{item.nom}</div>
								<input type="number" placeholder="quantité à choisir" onChange={(e) => handleChangeQuantité(e, item)}></input>
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
