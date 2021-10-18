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
	// let [bddName, setBddName] = useState(null);
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
				console.log(data);
				const platUnique = new Set(data.map((plat) => plat.nom_plat));
				setBddIngredients([...new Set(data.map((plat) => plat.nom_ingredient))]);
				let platsAvecIngredient = [];
				for (const iterator of platUnique) {
					let ingredients = [];
					for (const iterator2 of data) {
						if (iterator2.nom_plat == iterator) ingredients.push(iterator2.nom_ingredient);
					}
					// console.log(iterator);
					const platAvecIngredient = data.filter((e) => e.nom_plat == iterator)[0];
					platsAvecIngredient.push({ nom_plat: platAvecIngredient.nom_plat, féculentsConseillés: platAvecIngredient.féculentsConseillés, légumesConseillés: platAvecIngredient.légumesConseillés, midiSoir: platAvecIngredient.midiSoir, nbrDeRepasPossible: platAvecIngredient.nbrDeRepasPossible, ingredients, saison: platAvecIngredient.saison, tempsDePreparation: platAvecIngredient.tempsDePreparation, typePlat: platAvecIngredient.typePlat, typeViande: platAvecIngredient.typeViande });
					// console.log(platsAvecIngredient);
				}
				setBddPlats(platsAvecIngredient);
			});
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
	};

	const choisirIngredient = (item) => {
		console.log(item);
		if (!ingredientsChoisi.includes(item)) setIngredientsChoisi([...ingredientsChoisi, item]);
	};
	const ajouterPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);
	};
	const validerNouveauPlat = () => {
		setIsAjoutPlatVisible(!isAjoutPlatVisible);
	};
	const choisirSaisonPopup = () => {
		setIsChoisirSaisonVisible(!isChoisirSaisonVisible);
	};
	const choisirSaison = (_saison) => {
		console.log(`le choix de la saison est ${_saison}`)
		if (_saison==null) setSaison([])
		else	setSaison([...saison,_saison])
	};
	const choisirTypePopup = () => {
		setIsChoisirTypeVisible(!isChoisirTypeVisible);
	};
	const choisirType = (_type) => {
		console.log(`le choix du type est ${_type}`)
		if (_type==null) setPlatType([])
		else	setPlatType([...platType,_type])
	};
	const choisirMidiSoirPopup = () => {
		setIsChoisirMidiSoirVisible(!isChoisirMidiSoirVisible);
	};
	const choisirMidiSoir = (_MidiSoir) => {
		console.log(`le choix du MidiSoir est ${_MidiSoir}`)
		if (_MidiSoir==null) setPlatMidiSoir([])
		else	setPlatMidiSoir([...platMidiSoir,_MidiSoir])
	};
	const choisirVitessePopup = () => {
		setIsChoisirVitesseVisible(!isChoisirVitesseVisible);
	};
	const choisirVitesse = (_Vitesse) => {
		console.log(`le choix du Vitesse est ${_Vitesse}`)
		// if (_Vitesse==null) setPlatVitesse([])
			setPlatVitesse(_Vitesse)
	};
	const choisirTypeViandePopup = () => {
		setIsChoisirTypeViandeVisible(!isChoisirTypeViandeVisible);
	};
	const choisirTypeViande = (_TypeViande) => {
		console.log(`le choix du TypeViande est ${_TypeViande}`)
		if (_TypeViande==null) setPlatTypeViande([])
		else	setPlatTypeViande([...platTypeViande,_TypeViande])
	};
	return (
		<div style={{ flex: 1, backgroundColor: "white" }}>
			{!isAjoutPlatVisible && (
				<div>
					<label>recherche</label>
					<div style={{ backgroundColor: "grey" }}>{platTrouvés && platTrouvés.map((plat) => <div>{plat.nom_plat}</div>)}</div>
					<input placeholder="recherche de plat existant" onChange={(platName) => recherchePlat(platName)} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<button onClick={ajouterPlat}>Ajouter un plat</button>
					<br />
				</div>
			)}
			{isAjoutPlatVisible && (
				<div>
					<label>Nom du plat</label><br />
					<input placeholder="Comment s'appelle ce nouveau plat ?" maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />

					<label>Saison</label><br />
					<input placeholder={saison.length==0?"Ce plat correspond t il à une saison particuliere ?":saison.toString()}  onFocus={choisirSaisonPopup} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />
					{isChoisirSaisonVisible &&
						<div>
							<button onClick={()=>choisirSaison('été')}>été</button>
							<button onClick={()=>choisirSaison('automne')}>automne</button>
							<button onClick={()=>choisirSaison('hiver')}>hiver</button>
							<button onClick={()=>choisirSaison('printemps')}>printemps</button>
							<button onClick={()=>choisirSaison(null)}>Pas de saison particulière</button>
						</div>}
					<label>Type</label><br />
					<input placeholder={platType.length==0?"Ce plat a t il un type particulier ?":platType.toString()} onFocus={choisirTypePopup} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />
					{/* '0=defaut 1=tarte 2=vegetarien 3=light 4=extra' */}
					{isChoisirTypeVisible &&
						<div>
							<button onClick={()=>choisirType('tarte')}>tarte</button>
							<button onClick={()=>choisirType('vegetarien')}>vegetarien</button>
							<button onClick={()=>choisirType('light')}>light</button>
							<button onClick={()=>choisirType('extra')}>extra</button>
							<button onClick={()=>choisirType(null)}>Pas de type particulier</button>
						</div>}
					<label>Midi/Soir</label><br />
					<input placeholder={platMidiSoir.length==0?"Ce plat est il pour un midi ou le soir ?":platMidiSoir.toString()} maxLength={225} onFocus={choisirMidiSoirPopup} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					{isChoisirMidiSoirVisible &&
						<div>
							<button onClick={()=>choisirMidiSoir('midi')}>midi</button>
							<button onClick={()=>choisirMidiSoir('soir')}>soir</button>
							<button onClick={()=>choisirMidiSoir(null)}>peu importe</button>
						</div>}
					<br />
					<label>Préparation</label><br />
							<input placeholder={platVitesse.length==0?"Ce plat est il rapide a préparer ?":platVitesse.toString()} maxLength={225} onFocus={choisirVitessePopup} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					{isChoisirVitesseVisible &&
						<div>
							<button onClick={()=>choisirVitesse("aucune préparation")}>aucune préparation</button>
							<button onClick={()=>choisirVitesse("rapide")}>rapide</button>
							<button onClick={()=>choisirVitesse("y a pas mal de boulot")}>y a pas mal de boulot</button>
							<button onClick={()=>choisirVitesse("La plus grosse préparation")}>La plus grosse préparation</button>
						</div>}
					<br />
					<label>Recette</label><br />
					<input placeholder="Ce plat a t il une recette en ligne ?" maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />
					<label>Type de viande</label><br />
							<input placeholder={platTypeViande.length==0?"quel type de viande ce plat possède t il ?":platTypeViande.toString()} maxLength={225} onFocus={choisirTypeViandePopup} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					{isChoisirTypeViandeVisible &&
						<div>
							<button onClick={()=>choisirTypeViande('dinde')}>dinde</button>
							<button onClick={()=>choisirTypeViande('poulet')}>poulet</button>
							<button onClick={()=>choisirTypeViande('boeuf')}>boeuf</button>
							<button onClick={()=>choisirTypeViande('porc')}>porc</button>
							<button onClick={()=>choisirTypeViande('végétarien')}>végétarien</button>
							<button onClick={()=>choisirTypeViande(null)}>peu importe</button>
						</div>}
					<div style={{ backgroundColor: "grey" }}>
						{ingredientTrouvés &&
							ingredientTrouvés.map((ingredient) => (
								<div>
									<div onClick={() => choisirIngredient(ingredient)}>{ingredient}</div>
									<br />
								</div>
							))}
					</div>
					<label>Ingrédients</label><br />
					<input placeholder="quels sont les ingrédients ?" onChange={(platName) => rechercheIngredient(platName)} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
					<br />
					<label>ingredient choisis</label>
					<div style={{ display: "flex", flexDirection: "column" }}>
						{ingredientsChoisi.map((item) => (
							<div>{item}</div>
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
