import React, { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";

const NewPlat = () => {
	let [bddPlats, setBddPlats] = useState(null);
	let [bddIngredients, setBddIngredients] = useState(null);
	let [platTrouvés, setPlatTrouvés] = useState(null);
	let [ingredientTrouvés, setIngredientTrouvés] = useState(null);
	// let [bddName, setBddName] = useState(null);
	let [platName, setPlatName] = useState("");
	let [platType, setPlatType] = useState("");
	let [midiSoir, setMidiSoir] = useState("");
	let [ingredientsChoisi, setIngredientsChoisi] = useState([]);
	let [saison, setSaison] = useState("");
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

	const choisirIngredient =(item)=>{
		console.log(item)
		if (!ingredientsChoisi.includes(item)) setIngredientsChoisi([...ingredientsChoisi,item])
	}
	return (
		<div style={{ flex: 1, backgroundColor: "white" }}>
			<label>recherche</label>
			<div style={{ backgroundColor: "grey" }}>{platTrouvés && platTrouvés.map((plat) => <div>{plat.nom_plat}</div>)}</div>
			<input placeholder="recherche de plat existant" onChange={(platName) => recherchePlat(platName)} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
			<br />
			<div style={{ backgroundColor: "grey" }}>
				{ingredientTrouvés &&
					ingredientTrouvés.map((ingredient) => (
						<div>
							<div onClick={()=>choisirIngredient(ingredient)}>{ingredient}</div>
							<br />
						</div>
					))}
			</div>
			<input placeholder="quels sont les ingrédients ?" onChange={(platName) => rechercheIngredient(platName)} maxLength={225} multiline="true" style={{ textAlignVertical: "top", padding: 10, fontSize: 25 }} />
			<br />
			<label>ingredient choisis</label>
			<div style={{ display: "flex",flexDirection:"column" }}>{ingredientsChoisi.map(item=><div>{item}</div>)}</div>
			<br />
			<br />

			<button onClick={() => console.log("coucou")}>VALIDER ?</button>
		</div>
	);
};

export default NewPlat;
