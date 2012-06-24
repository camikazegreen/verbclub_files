<?php

class VerbTypeController extends DrupalDefaultEntityController {
    
    public function save($verbtype) {
        drupal_write_record('verbtype', $verbtype);
        field_attach_insert('verbtype', $verbtype);
        module_invoke_all('entity_insert', 'verbtype', $verbtype);
        return $verbtype;
    }
}