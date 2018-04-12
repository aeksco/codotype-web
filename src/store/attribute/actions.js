import _ from 'lodash'
import ObjectID from 'bson-objectid'
import { DEFAULT_ATTRIBUTE } from './constants'
import { SELECT_MODEL_ACTIONS, EDIT_MODEL_ACTIONS } from '@/store/lib/mixins'

// Attribute module actions
export default {
  ...SELECT_MODEL_ACTIONS,
  ...EDIT_MODEL_ACTIONS,
  resetNewModel ({ state, commit }) {
    let newModel = _.cloneDeep(DEFAULT_ATTRIBUTE)
    newModel.order = state.collection.length
    return commit('newModel', newModel)
  },
  create ({ state, commit, dispatch, rootGetters }) {
    let model = _.cloneDeep(state.newModel)
    let modelSchema = rootGetters['schema/selectedModel']

    // console.log(modelSchema)
    // console.log(modelSchema._id)

    // Assigns ID to attribute
    model._id = ObjectID().toString()

    // Pulls relational metadata (if needed)
    if (model.datatype === 'RELATION') {
      const relationType = model.datatypeOptions.relationType
      const relatedSchemaId = model.datatypeOptions.schema_id

      // Gets relatedSchema from schema/collection
      let relatedSchema = _.find(rootGetters['schema/collection'], { _id: relatedSchemaId })

      // Handles HAS_MANY
      if (relationType === 'HAS_MANY') {
        console.log('HAS_MANY')
        console.log(relatedSchema.label_plural)
        console.log(relatedSchema.identifier + '_ids')

        // Defines related label and identifier on attribute
        model.label = relatedSchema.label_plural
        model.identifier = relatedSchema.identifier + '_ids' // TODO - this should only be used for MANY_TO_MANY?
        // model.datatypeOptions.schema_attribute_identifier = '_id' // TODO
        // model.datatypeOptions.schema_attribute_identifier = relatedSchema.attributes[0].identifier

        // Defines inverse relation on relatedSchema
        // INVERSE OF HAS_MANY === BELONGS_TO
        let reverseRelation = _.cloneDeep(DEFAULT_ATTRIBUTE)
        reverseRelation._id = ObjectID().toString()
        reverseRelation.datatype = 'RELATION'
        reverseRelation.order = relatedSchema.attributes.length + 1
        reverseRelation.label = modelSchema.label
        reverseRelation.identifier = modelSchema.identifier + '_id'
        // reverseRelation.datatypeOptions.schema_attribute_identifier = '_id' // TODO
        reverseRelation.datatypeOptions.relationType = 'BELONGS_TO'
        reverseRelation.datatypeOptions.schema_id = modelSchema._id

        // Assigns reverse-relational IDs
        model.datatypeOptions.reverse_relation = reverseRelation._id
        reverseRelation.datatypeOptions.reverse_relation = model._id

        // TODO - remove these log statements
        console.log('RELATION:')
        console.log(JSON.stringify(model, null, 2))
        console.log('REVERSE RELATION:')
        console.log(JSON.stringify(reverseRelation, null, 2))

        // Adds the reverse relation to the relatedSchema
        let relatedSchemaAttrs = relatedSchema.attributes
        relatedSchemaAttrs.push(reverseRelation)
        commit('schema/attributes', { schema_id: relatedSchemaId, collection: relatedSchemaAttrs }, { root: true })
      }

      // Handles BELONGS_TO
      if (relationType === 'BELONGS_TO') {
        console.log('BELONGS_TO')
        console.log(relatedSchema.label)
        console.log(relatedSchema.identifier + '_id')

        model.label = relatedSchema.label
        model.identifier = relatedSchema.identifier + '_id'
        model.datatypeOptions.schema_attribute_identifier = '_id' // TODO
        // model.datatypeOptions.schema_attribute_identifier = relatedSchema.attributes[0].identifier

        // Defines inverse relation on relatedSchema
        // INVERSE OF MANY_TO_ONE === HAS_MANY
      }
    }

    // Updates the collection belonging to the currently selected schema
    let collection = state.collection
    collection.push(model)
    commit('collection', collection)
    commit('schema/attributes', { collection }, { root: true })
    dispatch('resetNewModel')
  },
  update ({ state, commit, dispatch }) {
    let model = _.cloneDeep(state.editModel)

    let collection = state.collection.map((m) => {
      if (m._id === model._id) {
        return model
      } else {
        return m
      }
    })

    commit('collection', collection)
    commit('schema/attributes', { collection }, { root: true })
    dispatch('clearEditModel')
  },
  destroy ({ state, commit }, model) {
    // TODO - REMOVE REVERSE RELATION HERE
    console.log('DESTROY ATTRIBUTE')
    console.log(model)
    // let collection = _.filter(state.collection, (m) => { return m._id !== model._id })
    // commit('collection', collection)
    // commit('schema/attributes', { collection }, { root: true })
  }
}