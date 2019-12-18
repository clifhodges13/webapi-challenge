const express = require("express");
const router = express.Router();
const db = require("../data/helpers/projectModel");
const actionsDb = require("../data/helpers/actionModel");

// GET all projects
router.get("/", (req, res) => {
  db.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json({ errorMessage: "There was a problem retrieving the projects from the database. Please try again later." }))
});

// GET project by id
router.get("/:id", (req, res) => {
  db.get(req.params.id)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(500).json({ errorMessage: "There was a problem retrieving the project from the database. Please try again later." }))
});

// GET all actions for a project
router.get("/:id/actions", (req, res) => {
  db.getProjectActions(req.params.id)
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ errorMessage: "There was an error retrieving the actions from the database, Please try again later." }))
});

// GET action by id
router.get("/:id/actions/:action_id", (req, res) => {
  db.get(req.params.id)
    .then(project => {
      if(project) {
        return project
    } else {
      res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
    }})
    .then(proj => {
        const actions = proj.actions
        const action = actions.find(act => act.id == req.params.action_id)
        res.status(200).json(action)
      })
    .catch(err => res.status(500).json({ errorMessage: "There was a problem retrieving the project from the database. Please try again later." }))
});

// POST a new project
router.post("/", (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ message: "Please include a name and description." })
  }
  db.insert(req.body)
    .then(proj => res.status(201).json(proj))
    .catch(err => res.status(500).json({ errorMessage: "There was a problem adding the project to the database. Please try again later." }))
});

// POST a new action
router.post("/:id/actions", (req, res) => {
  if (!req.body.notes || !req.body.description) {
    return res.status(400).json({ message: "Please include a description and notes." })
  }
  db.get(req.params.id)
    .then((project) => {
      if(project) {
        return project
    } else {
      res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
    }})
    .then(proj => {
      console.log(req.body)
      actionsDb.insert(req.body)
        .then(act => res.status(201).json(act))
        .catch(err => res.status(500).json({ errorMessage: "There was a problem adding the action to the database. Please try again later." }))
    })
    .catch(err => res.status(500).json({ errorMessage: "An internal error occurred. Please try again later." }))
});

// PUT an existing project
router.put("/:id", (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ message: "Please include a name and description." })
  }
  db.update(req.params.id, req.body)
    .then(updatedProj => res.status(200).json({ updatedProject: updatedProj }))
    .catch(err => res.status(500).json({ errorMessage: "There was a problem updating the project. Please try again later." }))
})

// PUT an existing action
router.put("/:id/actions/:actId", (req, res) => {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    return res.status(400).json({ message: "Please include a description, notes, and the project_id for the associated project." })
  }
  db.get(req.params.id)
    .then((project) => {
      if(project) {
        return project
    } else {
      res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
    }})
    .then(proj => {
      const actions = proj.actions
      const action = actions.find(act => act.id == req.params.actId)
      if (action) {
        return action
      } else {
        res.status(404).json({ errorMessage: "The action with the specified ID does not exist." })
      }
    })
    .then(action => {
      actionsDb.update(action.id, req.body)
        .then(updateAction => res.status(200).json({ updatedAction: updateAction }))
        .catch(err => res.status(500).json({ errorMessage: "There was a problem updating the action. Please try again later." }))
    })
    .catch(err => res.status(500).json({ errorMessage: "An internal error occurred. Please try again later." }))
})

// DELETE an existing project
router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(numDeleted => numDeleted)
    .then(deleted => {
      if (deleted === 1) {
        res.status(200).json({
          numberOfProjectsDeleted: deleted,
          idOfDeletedProject: req.params.id
        })
      } else if (deleted === 0) {
        res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: "There was a problem deleting the project. Please try again later." }))
})

// DELETE an existing action
router.delete("/:id/actions/:actId", (req, res) => {
  db.get(req.params.id)
    .then(project => {
      if(project) {
        return project
    } else {
      res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
    }})
    .then(proj => {
      actionsDb.remove(req.params.actId)
        .then(deleted => {
          if (deleted === 1) {
            res.status(200).json({
              numberOfActionsDeleted: deleted,
              idOfDeletedAction: req.params.actId
            })
          } else if (deleted === 0) {
            res.status(404).json({ errorMessage: "The project with the specified ID does not exist." })
          }
        })
    })
})

module.exports = router;