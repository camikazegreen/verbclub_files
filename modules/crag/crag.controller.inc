<?php

class CragController extends DrupalDefaultEntityController {
    
    public function save($crag) {
        drupal_write_record('crags', $crag);
        field_attach_insert('crag', $crag);
        module_invoke_all('entity_insert', 'crag', $crag);
        return $crag;
    }
}